Meteor.methods({

  remove_torrent: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, [String]);

    var A = _torrent.update({
      _id: {
        $in: input,
      },
    }, {
      $addToSet: {
        user_removed: user._id,
      },
    }, {
      multi: true,
    });

    return (A ? A + ' item ' : '') + 'removed';
  },

  restore_torrent: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, [String]);

    var A = _torrent.update({
      _id: {
        $in: input,
      },
    }, {
      $pull: {
        user_removed: user._id,
      },
    }, {
      multi: true,
    });

    return (A ? A + ' item ' : '') + 'restored';
  },

});
