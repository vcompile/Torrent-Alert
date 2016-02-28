Meteor.methods({

  remove_torrent: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, {
      project: String,
      torrent: [String]
    });

    _torrent.update({
      _id: {
        $in: input.torrent
      },
      project: input.project,
      user: user._id
    }, {
      $pull: {
        user: user._id
      }
    }, {
      multi: true
    });
  }

});
