import cheerio from 'cheerio';
import Future from 'fibers/future';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Nightmare from 'nightmare';
import url from 'url';

import { _project } from '../../db/projects.js';
import { _torrent } from '../../db/torrents.js';
import { _url } from '../../db/urls.js';
import { _worker } from '../../db/workers.js';

export const _nightmare = {
  _queue: [], trigger() {
    const N = Nightmare({ /*openDevTools: true, show: true,*/ switches: { 'ignore-certificate-errors': true, 'proxy-bypass-list': "<local>", 'proxy-server': process.env.PROXY_SERVER } });

    N.authentication(process.env.PROXY_USER, process.env.PROXY_PASSWORD).on('crashed', (e, killed) => { N.halt(); _nightmare.trigger(); }).useragent('Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0');

    const getHTML = (url) => {
      const F = new Future();
      const T = Meteor.setTimeout(() => { Meteor.clearTimeout(T); F['return'](''); }, 1000 * 60);

      try {
        N.goto('http://torrentz2.eu' + url).wait('#thesearchbox').evaluate(() => { return document.querySelector('body') ? document.querySelector('body').innerHTML : ''; }).then((html) => { Meteor.clearTimeout(T); F['return'](html); });
      } catch (e) {
        Meteor.clearTimeout(T); F['return']('');
      }

      return F.wait();
    };

    const getJSON = (url) => {
      const F = new Future();
      const T = Meteor.setTimeout(() => { Meteor.clearTimeout(T); F['return'](null); }, 1000 * 60);

      try {
        N.goto('http://torrentz2.eu').wait('#thesearchbox').evaluate((url, done) => { $.getJSON('http://torrentz2.eu' + url, (json) => { done(null, json); }).fail(() => { done(null, null); }); }, url).then((json) => { Meteor.clearTimeout(T); F['return'](json ? _.uniq(_.flatten(json)) : null); });
      } catch (e) {
        Meteor.clearTimeout(T); F['return'](null);
      }

      return F.wait();
    };

    let worker = null;
    while (worker = _worker.findOne({ _id: { $nin: _nightmare._queue }, status: '', type: { $in: ['keyword', 'project', 'torrent'] } }, { fields: { query: 1, type: 1 }, sort: { type: 1 } })) {
      _nightmare._queue.push(worker._id);

      switch (worker.type) {

        case 'keyword':
          const json = getJSON(worker.query);
          if (json) {
            if (json.length) {
              let project = [];

              json.forEach((title) => {
                title = title.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

                if (title) {
                  const query = '/search?f=' + title + ' added:999d seed > 0';

                  const exists = _project.findOne({ query: { $options: 'i', $regex: '^' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { _id: true } });

                  if (exists) { project.push(exists._id); }
                  else { project.push(_project.insert({ query, title })); }
                }
              });

              _worker.update(worker._id, { $set: { project, status: '200', time: moment().toDate() } });
            } else { _worker.update(worker._id, { $set: { status: 'No Item Found' } }); }
          } else { _worker.update(worker._id, { $set: { status: 'Server Not Responding' } }); }
          break;

        case 'project': {
          const project = _project.findOne({ query: { $options: 'i', $regex: '^' + worker.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { _id: true } });

          const html = getHTML(worker.query);
          if (html) {
            const $ = cheerio.load(html);

            const TC_string = ($('.results h2').length ? $('.results h2').text().match(/([0-9,]+) Torrents/i) : null);
            const TC_integer = (TC_string && TC_string[1] ? +TC_string[1].replace(/[^0-9]+/g, '') : null);

            if (TC_integer) {
              _project.update(project._id, { $set: { torrent_count: TC_integer } });
            }

            $('.results dl').each(function () {
              if ($(this).find('dt a').attr('href')) {
                const torrent = {

                  title: $(this).find('dt a').text().replace(/\[email protected\].*\*\//g, ' ').replace(/\s+/g, ' ').trim(),
                  query: $(this).find('dt a').attr('href'),
                  category: $(this).find('dt').children().remove().end().text().replace(/»/g, '').replace(/\s+/g, ' ').trim(),

                  very_good: ($(this).find('dd span:nth-child(1)').text().replace(/[^✓]/g, '') ? true : null),
                  time: (moment($(this).find('dd span:nth-child(2)').attr('title'), ['X']).isValid() ? moment($(this).find('dd span:nth-child(2)').attr('title'), ['X']).toDate() : moment().toDate()),
                  size: $(this).find('dd span:nth-child(3)').text().replace(/\s+/g, ' ').trim(),
                  leech: +$(this).find('dd span:nth-child(4)').text().replace(/[^0-9]+/g, ''),
                  seed: +$(this).find('dd span:nth-child(5)').text().replace(/[^0-9]+/g, ''),

                };

                const exists = _torrent.findOne({ query: torrent.query }, { fields: { _id: true } });
                if (exists) {
                  _torrent.update(exists._id, { $addToSet: { project: project._id }, $set: torrent });

                  const W = _worker.findOne({ query: torrent.query }, { fields: { status: true, time: true } });
                  if (W) {
                    if (W.status != '200' || 1 < moment.duration(moment().diff(W.time)).asDays()) {
                      _worker.update(W._id, { $set: { status: '', time: moment().toDate() } });
                    }
                  } else {
                    _worker.insert({ query: torrent.query, status: '', time: moment().toDate(), type: 'torrent' });
                  }
                } else {
                  _torrent.insert(_.extend(torrent, { project: [project._id], url: [] })); _worker.insert({ query: torrent.query, status: '', time: moment().toDate(), type: 'torrent' });
                }
              }
            });

            let recent = [];
            $('#recent a').each(function () {
              if ($(this).attr('href')) {
                const title = $(this).text().replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

                const query = '/search?f=' + title + ' added:999d seed > 0';

                const exists = _project.findOne({ query: { $options: 'i', $regex: '^' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { _id: true } });

                if (exists) { recent.push(exists._id); }
                else { recent.push(_project.insert({ query, title })); }
              }
            });

            const W = _worker.findOne('recent', { fields: { time: true } });
            if (W) {
              if (3 < moment.duration(moment().diff(W.time)).asMinutes()) {
                _worker.update('recent', { $set: { project: recent, time: moment().toDate() } });
              }
            } else {
              _worker.insert({ _id: 'recent', project: recent, status: '200', time: moment().toDate() });
            }

            _worker.update(worker._id, { $set: { status: TC_integer ? '200' : 'No Item Found', time: moment().toDate() } });
          } else { _worker.update(worker._id, { $set: { status: 'Server Not Responding' } }); }
        } break;

        case 'torrent': {
          const torrent = _torrent.findOne({ query: worker.query }, { fields: { _id: true } });

          const html = getHTML(worker.query);
          if (html) {
            const $ = cheerio.load(html);

            let href = [];
            $('.downlinks dl').each(function () {
              const _href = url.parse($(this).find('dt a').attr('href'));

              if (_href.pathname && _href.hostname && ['s3-us-west-2.amazonaws.com'].indexOf(_href.hostname) == -1) {
                const exists = _url.findOne({ query: { $options: 'i', $regex: '^' + _href.href.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { _id: true } });

                if (exists) { href.push(exists._id); }
                else {
                  href.push(_url.insert({ query: _href.href, time: (moment($(this).find('dd span').attr('title'), ['ddd, DD MMM YYYY HH:mm:ss']).isValid() ? moment($(this).find('dd span').attr('title'), ['ddd, DD MMM YYYY HH:mm:ss']).toDate() : moment().toDate()), title: _href.hostname }));
                }
              }
            });

            if (href.length) {
              _torrent.update(torrent._id, { $set: { url: href } });
            }

            _worker.update(worker._id, { $set: { status: href.length ? '200' : 'No Item Found', time: moment().toDate() } });
          } else { _worker.update(worker._id, { $set: { status: 'Server Not Responding' } }); }
        } break;

      }

      _nightmare._queue = _.reject(_nightmare._queue, (_id) => { return worker._id == _id; });
    }

    N.halt();
  },
};
