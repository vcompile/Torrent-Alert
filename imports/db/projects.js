import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _project = new Meteor.Collection("projects");

if (Meteor.isServer) {
  _project._ensureIndex({ query: 1 });

  Meteor.publish('project', (input) => { check(input, [String]); return _project.find({ _id: { $in: input }, deny: { $exists: false } }, { fields: { deny: false }, limit: 15 }); });
}
