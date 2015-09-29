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

        torrent_out.find().forEach(function(row) {
            if (row.torrent_in.length) {
                var _age = 1;

                row.torrent_in.forEach(function(id) {
                    var A = torrent_in.findOne({
                        _id: id
                    });

                    if (A) {
                        if (A.age == 0) {
                            _age = 48;
                        }

                        if (_age < A.age) {
                            _age = A.age;
                        }
                    } else {
                        torrent_out.update({
                            _id: row._id
                        }, {
                            $pull: {
                                torrent_in: id
                            }
                        });
                    }
                });

                if (_age < Math.floor(moment.duration(moment().diff(moment(row.time, "X"))).asMonths())) {
                    torrent_out.remove({
                        _id: row._id
                    });
                }
            } else {
                torrent_out.remove({
                    _id: row._id
                });
            }
        });
    }).run();
}, 1000 * 60 * 60 * 12);
