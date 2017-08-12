import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _nightmare } from '../config/nightmare.js';
import { _torrent } from '../../db/torrents.js';
import { _worker } from '../../db/workers.js';

Meteor.methods({

  'remove.torrent'(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, [String]);

    return _torrent.update({ _id: { $in: input } }, { $addToSet: { user_removed: user._id } }, { multi: true });
  },

  'restore.torrent'(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, [String]);

    return _torrent.update({ _id: { $in: input } }, { $pull: { user_removed: user._id } }, { multi: true });
  },

  'trigger.torrent'(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, String);

    let torrent = _torrent.findOne(input, { fields: { query: true } });

    if (torrent) {
      let worker = _worker.findOne({ query: torrent.query }, { fields: { status: true, time: true } });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } }); Meteor.setTimeout(() => { _nightmare.trigger(); });
        }
      } else {
        _worker.insert({ query: torrent.query, status: '', time: moment().toDate(), type: 'torrent' }); Meteor.setTimeout(() => { _nightmare.trigger(); });
      }

      return torrent._id;
    }
  },

});
