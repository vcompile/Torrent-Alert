Meteor.setInterval(function() {
    new fibers(function() {

        torrent_in.find().forEach(function(A) {
            if (A.user_id.length == 0) {

                torrent_out.find({
                    torrent_in: A._id
                }).forEach(function(B) {
                    if (B.torrent_in.length < 1) {

                        torrent_out.update({
                            _id: B._id
                        }, {
                            $pull: {
                                torrent_in: A._id
                            }
                        });

                    } else {

                        torrent_out.remove({
                            _id: B._id
                        });

                    }
                });

            }
        });

    }).run();
}, 1000 * 60 * 60 * 12);
