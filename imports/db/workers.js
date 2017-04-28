import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _worker = new Meteor.Collection("workers");

if (Meteor.isServer) {
  _worker._ensureIndex({ input: 1, status: 1, type: 1 });

  Meteor.publish('worker', function (input) {
    if (Match.test(input, [String])) {
      return _worker.find({ _id: { $in: input }, deny: { $exists: false } }, { fields: { deny: false }, limit: 15, sort: { time: -1 } });
    } else {
      check(input, String); return _worker.find({ query: { $options: 'i', $regex: '^' + input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { deny: false }, sort: { time: -1 } });
    }
  });
}
