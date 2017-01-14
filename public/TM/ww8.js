// ==UserScript==
// @author       linto.cet@gmail.com
// @description  ww8.heroku
// @match        *://localhost:3000/*
// @match        *://ww8.herokuapp.com/*
// @name         ww8.heroku
// @namespace    *://localhost:3000/*
// @require      http://momentjs.com/downloads/moment.min.js
// @require      http://underscorejs.org/underscore-min.js
// @version      1.0.0
// ==/UserScript==

'use strict';

var TM = { error: null, observer: null, origin: null, received: null, scheduler: null, send: null, window: null },
  keyword_normalizer = function(keyword) {
    return keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();
  };

TM_observer = function(input) {
  console.log('TM_observer', input);

  if (Meteor.user()._id == 'ADMIN') {
    Meteor.subscribe('worker', input);

    TM.observer = _worker.find(input.query, input.opt).observe({
      addedAt: function(row) {
        TM.send = +TM.send + 1;
        TM.window.postMessage(row, TM.origin);
      },
    });
  }
};

TM_scheduler = function(interval) {
  if (Meteor.user()._id == 'ADMIN') {
    TM.scheduler = Meteor.setInterval(function() {
      Meteor.call('trigger_PN', function(error, res) {
        console.log('TM_scheduler', error ? error : res);
      });
    }, interval);
  }
};

TM_start = function(origin) {
  console.log('TM_start', origin);

  TM.origin = origin;
  TM.window = window.open(origin, 'worker');

  window.addEventListener('message', function(e) {
    if (e.origin != TM.origin) {
      return;
    } else {
      TM.received = +TM.received + 1;

      TM_worker(e.data);
    }
  }, false);
};

TM_status = function() {
  console.log(TM.error, TM.origin, TM.received, TM.send);
};

TM_stop = function() {
  if (TM.observer) {
    TM.observer.stop();
  }

  if (TM.scheduler) {
    Meteor.clearInterval(TM.scheduler);
  }
};

TM_worker = function(input) {
  if (input.error) {
    TM.error = +TM.error + 1;
  }

  Meteor.call('update_worker', input, function(error, res) {
    if (error) {
      console.log('TM_worker', 'error', error);
    }
  });
};
