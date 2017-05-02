import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';

import { _worker } from '../../../db/workers.js';

Polymer({

  _route_changed(route) {
    if (route.page == 'search') {
      Meteor.subscribe('worker', route._id.split('|'));

      if (this._search_tracker) {
        this._search_tracker.stop();
      }

      this.set('_search_tracker', Tracker.autorun(() => {
        this.set('worker', _worker.findOne(route._id, { fields: { project: 1, status: 1, time: 1 } }));
      }));
    }
  },

  _search(e) {
    if (this._search_timer) {
      Meteor.clearTimeout(this._search_timer);
    }

    const value = e.target.value.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

    if (value) {
      this.set('_search_timer', Meteor.setTimeout(() => {
        Meteor.call('insert.keyword', value, (error, res) => {
          if (error) {
            document.querySelector('#toast').toast(error.message);
          } else {
            document.querySelector('#main').set('router.path', '/search/' + res);
          }
        });
      }, 1000));
    }
  },

  _status(worker = {}) {
    switch (worker.status) {

      case '':
        return 'Indexing';
        break;

      case '200':
        return (worker.project.length ? 'Updated At ' + (moment(worker.time).isValid() ? moment(worker.time).format('ddd Do MMM') : moment().format('ddd Do MMM')) : 'No Item Found');
        break;

      default:
        return worker.status;
        break;

    }
  },

  _user() {
    if (Meteor.user()) {
      document.querySelector('#main').set('router.path', '/user/' + Meteor.user()._id);
    } else {
      document.querySelector('#toast').toast('', 'SIGNIN');
    }
  },

  attached() {
    const W = document.querySelector('body').getBoundingClientRect().width;

    if (480 < W) {
      const N = document.querySelectorAll('.fab-bottom'); for (let index = 0; index < N.length; index++) { N[index].style.right = (W / 2 - 224) + 'px'; }
    }
  },

  is: 'layout-search',

  observers: ['_route_changed(route)'],

});

import './search-item.js';
