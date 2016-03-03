Meteor.methods({

  insert_favorite: function(torrent) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(torrent, [String]);

    return (Meteor.users.update({
      _id: user._id
    }, {
      $addToSet: {
        "profile.favorite": {
          $each: torrent
        }
      }
    }) ? torrent.length + " item moved to favorite" : "unknown error");
  },

  remove_favorite: function(torrent) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(torrent, [String]);

    return (Meteor.users.update({
      _id: user._id
    }, {
      $pull: {
        "profile.favorite": {
          $in: torrent
        }
      }
    }) ? torrent.length + " item removed" : "unknown error");
  }

});
