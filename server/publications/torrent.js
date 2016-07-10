Meteor.publish('torrent', function(input) {
  check(input, Match.OneOf({ limit: Number, project: [String] }, { project: [String], torrent: [String] }, { torrent: [String] }));
  return _torrent.find(_.extend((input.project ? { project: { $in: input.project } } : {}), (input.torrent ? { _id: { $in: input.torrent } } : {}), (this.userId ? { user_removed: { $ne: this.userId } } : {})), { fields: { user_recieved: false, user_removed: false }, limit: (input.limit ? input.limit : 150), sort: { insert_time: -1 } });
});
