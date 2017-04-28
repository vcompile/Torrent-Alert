import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _url = new Meteor.Collection("urls");

if (Meteor.isServer) {
  _url._ensureIndex({ query: 1 });

  Meteor.publish('url', (input) => { check(input, [String]); return _url.find({ _id: { $in: input }, deny: { $exists: false } }, { fields: { deny: false }, limit: 15 }); });
}
