// ==UserScript==
// @author       linto.cet@gmail.com
// @description  torrentz.me
// @match        *://torrentz2.me/*
// @name         torrentz.me
// @namespace    *://torrentz2.me/*
// @require      http://momentjs.com/downloads/moment.min.js
// @require      http://underscorejs.org/underscore-min.js
// @version      1.0.0
// ==/UserScript==

'use strict';

(function() {
  var origin = ['http://localhost:3000', 'https://ww8.herokuapp.com'];
  var pattern = new RegExp('^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$', 'i');
  var isURL = function(string) {
    return pattern.test(string);
  };
  var randomId = function(length) {
    return _.sample(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], length ? (isNaN(+length) ? 32 : length) : 32).join('');
  };
  var textStatusNormalizer = function(textStatus) {
    switch (textStatus) {

      case 'parsererror':
        textStatus = 'responseParseError';
        break;

      case 'timeout':
        textStatus = 'timeLimitExceed';
        break;

    }

    return textStatus;
  };

  window.addEventListener('message', function(e) {
    if (-1 == origin.indexOf(e.origin)) {
      return;
    }

    switch (e.data.type) {

      case 'keyword':
        $.getJSON(e.data.query, function(json) {
            e.data.keyword = _.uniq(_.flatten(json));
          })
          .complete(function() {
            e.source.postMessage(e.data, e.origin);
          })
          .fail(function(object, textStatus, errorThrown) {
            e.data.error = textStatusNormalizer(textStatus);
          });
        break;

      case 'project':
        $.get(e.data.query, function(html) {
            var id = randomId();
            $('body').append('<div id="' + id + '">' + html + '</div>');

            var count_string = ($('#' + id + ' .results h2').length ? $('#' + id + ' .results h2').text().match(/([0-9,]+) Torrents/i) : null);
            var count_integer = (count_string && count_string[1] ? +count_string[1].replace(/[^0-9]+/g, '') : null);
            e.data.torrent_count = (count_integer && 1 <= count_integer ? count_integer : null);

            e.data.torrent = [];
            $('#' + id + ' .results dl').each(function() {
              if ($(this).find('dt a').attr('href')) {
                e.data.torrent.push({

                  title: $(this).find('dt a').text().replace(/\[email protected\].*\*\//g, ' ').replace(/\s+/g, ' ').trim(),
                  query: $(this).find('dt a').attr('href'),
                  category: $(this).find('dt').children().remove().end().text().replace(/»/g, '').replace(/\s+/g, ' ').trim(),

                  very_good: ($(this).find('dd span:nth-child(1)').text().replace(/[^✓]/g, '') ? true : null),
                  time: (moment($(this).find('dd span:nth-child(2)').attr('title'), ['X']).isValid() ? moment($(this).find('dd span:nth-child(2)').attr('title'), ['X']).toDate() : moment().toDate()),
                  size: $(this).find('dd span:nth-child(3)').text().replace(/\s+/g, ' ').trim(),
                  leech: +$(this).find('dd span:nth-child(4)').text().replace(/[^0-9]+/g, ''),
                  seed: +$(this).find('dd span:nth-child(5)').text().replace(/[^0-9]+/g, ''),

                });
              }
            });

            e.data.recent = [];
            $('#' + id + ' #recent a').each(function() {
              if ($(this).attr('href')) {
                e.data.recent.push($(this).text().replace(/\s+/g, ' ').trim());
              }
            });

            $('#' + id).remove();
          })
          .complete(function() {
            e.source.postMessage(e.data, e.origin);
          })
          .fail(function(object, textStatus, errorThrown) {
            e.data.error = textStatusNormalizer(textStatus);
          });
        break;

      case 'torrent':
        $.get(e.data.query, function(html) {
            var id = randomId();
            $('body').append('<div id="' + id + '">' + html + '</div>');

            e.data.url = [];
            $('#' + id + ' .download dl').each(function() {
              if ($(this).find('dt a').attr('href') && isURL($(this).find('dt a').attr('href'))) {
                var url = new URL($(this).find('dt a').attr('href'));

                if (-1 == ['s3-us-west-2.amazonaws.com'].indexOf(url.hostname)) {
                  e.data.url.push({
                    query: $(this).find("dt a").attr("href"),
                    time: (moment($(this).find('dd span').attr('title'), ['ddd, DD MMM YYYY HH:mm:ss']).isValid() ? moment($(this).find('dd span').attr('title'), ['ddd, DD MMM YYYY HH:mm:ss']).toDate() : moment().toDate()),
                  });
                }
              }
            });

            $('#' + id).remove();
          })
          .complete(function() {
            e.source.postMessage(e.data, e.origin);
          })
          .fail(function(object, textStatus, errorThrown) {
            e.data.error = textStatusNormalizer(textStatus);
          });
        break;

      default:
        e.data.error = 'noType';
        e.source.postMessage(e.data, e.origin);
        break;

    }
  }, false);

  setInterval(function() {
    location.reload(true);
  }, 1000 * 60 * 5);
})();
