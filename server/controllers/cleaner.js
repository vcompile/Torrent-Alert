Meteor.setInterval(function() {
    new fibers(function() {
        torrent_in.find({
            "user_id.0": {
                $exists: false
            }
        }).forEach(function(A) {
            torrent_in.remove({
                _id: A._id
            });

            torrent_out.find({
                torrent_in: A._id
            }).forEach(function(B) {
                torrent_out.update({
                    _id: B._id
                }, {
                    $pull: {
                        torrent_in: A._id
                    }
                });
            });
        });

        torrent_out.find({
            "torrent_in.0": {
                $exists: false
            }
        }).forEach(function(A) {
            torrent_out.remove({
                _id: A._id
            });
        });
    }).run();
}, 1000 * 60);
