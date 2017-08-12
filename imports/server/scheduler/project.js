import fibers from 'fibers';
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _nightmare } from '../config/nightmare.js';
import { _project } from '../../db/projects.js';
import { _torrent } from '../../db/torrents.js';
import { _worker } from '../../db/workers.js';

Meteor.setInterval(() => {
  new fibers(() => {
    Meteor.users.find({}, { fields: { 'profile.subscribed': 1 } }).forEach((row) => {
      if (row.profile.subscribed && row.profile.subscribed.length) {
        row.profile.subscribed.forEach((subscribed) => {
          let project = _project.findOne(subscribed, { fields: { query: true, title: true } });

          if (project) {
            let torrent = _torrent.find({ project: project._id, user_subscribed: { $ne: row._id } }, { fields: { _id: 1 } }).fetch();

            if (torrent.length) {
              let OneSIgnal = HTTP.post('https://onesignal.com/api/v1/notifications', { data: { app_id: '6cf77bb0-6c75-47bf-bd3f-7adb8f195335', contents: { en: torrent.length + ' New Item Found' }, filters: [{ field: 'tag', key: 'user', relation: '=', value: row._id }], headings: { en: project.title }, included_segments: ['Allowed'], template_id: '8f953d89-f174-4e17-8088-064bd1b815ff', url: 'https://t.orrent.xyz/torrent/' + project._id + '?_id=' + _.map(torrent, (item) => { return item._id }).join('|') }, headers: { 'Authorization': 'Basic ZWFmZjQ3OTMtMWRkNC00MTJlLThlNmMtNzRmYWI2NzE2ZGVh', 'Content-Type': 'application/json; charset=utf-8' }, timeout: 1000 * 60 });
            }

            let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { status: true, time: true } });

            if (worker) {
              if (worker.status != '200' || 3 < moment.duration(moment().diff(worker.time)).asHours()) { // INTERVAL
                _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
              }
            } else {
              _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' });
            }
          } else {
            Meteor.users.update(row._id, { $pull: { 'profile.subscribed': subscribed } });
          }
        });
      }
    });

    Meteor.setTimeout(() => { _nightmare.trigger(); });
  }).run();
}, 1000 * 60 * 60);
