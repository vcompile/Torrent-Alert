Meteor.methods({

    insert_torrent_in: function(row) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        if (torrent_in.find({
                user_id: user._id
            }).count() < 10) {
            var query = _.pick(row, "keyword", "peers", "seeds", "url", "urlPart");

            var row = torrent_in.findOne(_.extend(_.clone(query), {
                    user_id: user._id
                })),
                row_id = null;

            if (row) {
                row_id = row._id;

                torrent_in.update(query, {
                    $addToSet: {
                        user_id: user._id
                    }
                }, {
                    multi: true
                });
            } else {
                row_id = torrent_in.insert(_.extend(_.clone(query), {
                    status: true,
                    time: moment().format(),
                    user_id: [user._id]
                }));
            }

            torrentz_query(query.urlPart, query.keyword, query.url).forEach(function(result) {
                var outputObject = torrent_out.find({
                    url: result.url
                });

                if (outputObject.count() <= 0) {
                    result.torrent_in = [row_id];

                    torrent_out.insert(result);
                } else {
                    outputObject.fetch().forEach(function(item) {
                        torrent_out.update({
                            url: item.url
                        }, {
                            $set: {
                                category: result.category,
                                verified: result.verified,
                                peers: result.peers,
                                seeds: result.seeds
                            },
                            $addToSet: {
                                torrent_in: row_id
                            }
                        }, {
                            multi: true
                        });
                    });
                }
            });

            return true;
        } else return false;
    },

    remove_torrent_in: function(id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        var row = torrent_in.findOne({
            _id: id,
            user_id: user._id
        });

        if (row) {
            if (1 < row.user_id.length) {
                return torrent_in.update({
                    _id: id,
                    user_id: user._id
                }, {
                    $pull: {
                        user_id: user._id
                    }
                });
            } else {
                return torrent_in.remove({
                    _id: id,
                    user_id: user._id
                });
            }
        } else return "notFound";
    }

});
