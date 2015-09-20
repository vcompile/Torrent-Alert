Meteor.setInterval(function() {
    new fibers(function() {
        torrent_in.find().forEach(function(A) {
            if (A.user_id.length == 0) {
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
            }
        });

        torrent_out.find().forEach(function(A) {
            if (A.torrent_in.length) {
                var _user_id = [];

                row.torrent_in.forEach(function(id) {
                    var A = torrent_in.findOne({
                        _id: id
                    });

                    _user_id = _user_id.concat(A.user_id);
                });

                if (_.difference(_.uniq(_user_id), row.hidden).length == 0) {
                    torrent_out.remove({
                        _id: A._id
                    });
                }
            } else {
                torrent_out.remove({
                    _id: A._id
                });
            }
        });
    }).run();
}, 1000 * 60 * 60 * 4);
