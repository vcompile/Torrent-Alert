Meteor.setInterval(function() {
  new fibers(function() {
    Meteor.users.find({
      "profile.favorite": {
        $exists: true
      }
    }).forEach(function(user) {
      _torrent.find({
        _id: {
          $in: user.profile.favorite
        },
        user: user._id
      }).forEach(function(item) {
        if (!(moment.duration(moment().diff(moment(item.time))).asHours() % 6)) {
          if (!_worker.findOne({
              status: "",
              torrent: item._id,
              type: "torrent"
            })) {
            _worker.insert({
              project: item.project, // ARRAY
              status: "",
              torrent: item._id,
              time_insert: moment().format(),
              type: "torrent",
              user: item.user
            });
          }
        }
      });
    });
  }).run();
}, 1000 * 60 * 60);
