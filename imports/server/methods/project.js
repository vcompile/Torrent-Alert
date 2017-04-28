import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _nightmare } from '../config/nightmare.js';
import { _project } from '../../db/projects.js';
import { _worker } from '../../db/workers.js';

Meteor.methods({

  'insert.project'(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, { query: String, title: String });

    let project = _project.findOne({ query: { $options: 'i', $regex: '^' + input.query + '$' } }, { fields: { query: true, worker: true } });

    if (project) {
      let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query + '$' } }, { fields: { status: true, time: true } });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } }); Meteor.setTimeout(() => { _nightmare.trigger(); });
        }
      } else {
        _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' }); Meteor.setTimeout(() => { _nightmare.trigger(); });
      }

      return project._id;
    } else {
      let _id = _project.insert(input); _worker.insert({ query: input.query, status: '', time: moment().toDate(), type: 'project' }); Meteor.setTimeout(() => { _nightmare.trigger(); }); return _id;
    }
  },

  'trigger.project'(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, String);

    let project = _project.findOne({ _id: input }, { fields: { query: true, worker: true } });

    if (project) {
      let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { status: true, time: true } });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } }); Meteor.setTimeout(() => { _nightmare.trigger(); });
        }
      } else {
        _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' }); Meteor.setTimeout(() => { _nightmare.trigger(); });
      }

      return project._id;
    }
  },

});
