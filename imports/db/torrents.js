import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _torrent = new Meteor.Collection("torrents");

if (Meteor.isServer) {
  _torrent._ensureIndex({ query: 1 });

  Meteor.publish('torrent', function (input) {
    check(input, Match.OneOf({ page: Number, project: [String] }, { project: [String], torrent: [String] }, { torrent: [String] }));

    let torrent = _torrent.find(_.extend({ deny: { $exists: false } }, (input.project ? { project: { $in: input.project } } : {}), (input.torrent ? { _id: { $in: input.torrent } } : {}), (this.userId ? { user_removed: { $ne: this.userId } } : {})), _.extend({ fields: { deny: false, user_removed: false, user_subscribed: false }, sort: { time: -1 } }, (input.page ? { limit: 15, skip: Math.abs(input.page - 1) * 15 } : {})));

    if (this.userId) {
      _torrent.update({
        _id: {
          $in: _.map(torrent.fetch(), (item) => {
            return item._id;
          })
        }
      }, { $addToSet: { user_subscribed: this.userId } }, { multi: true });
    }

    return torrent;
  });
}
