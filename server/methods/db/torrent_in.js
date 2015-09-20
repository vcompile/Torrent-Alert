Meteor.methods({

    insert_torrent_in: function(row) {
        this.unblock();

        check(row, {
            keyword: String,
            peers: Match.Integer,
            seeds: Match.Integer,
            urlPart: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user notFound");

        if (torrent_in.find({
                user_id: user._id
            }).count() < 4) {
            var query = _.pick(row, "keyword", "peers", "seeds", "urlPart");

            var row = torrent_in.findOne(query),
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
                    time: moment().format(),
                    user_id: [user._id]
                }));
            }

            torrent_in_worker(row_id);

            return true;
        } else return false;
    },

    remove_torrent_in: function(id) {
        this.unblock();

        check(id, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user notFound");

        var row = torrent_in.findOne({
            _id: id,
            user_id: user._id
        });

        if (row) {
            return torrent_in.update({
                _id: id,
                user_id: user._id
            }, {
                $pull: {
                    user_id: user._id
                }
            });
        } else return "notFound";
    }

});
