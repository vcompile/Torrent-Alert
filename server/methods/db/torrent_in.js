Meteor.methods({

    insert_torrent_in: function(row) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        if (torrent_in.find({
                user_id: user._id
            }).count() < 4) {
            var query = _.pick(row, "keyword", "peers", "seeds", "url", "urlPart");

            check(query, {
                keyword: String,
                peers: Integer,
                seeds: Integer,
                url: String,
                urlPart: String
            });

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
                var _torrent_worker = torrent_worker.find({
                    status: "UP"
                }).fetch();

                row_id = torrent_in.insert(_.extend(_.clone(query), {
                    status: moment().format(),
                    time: moment().format(),
                    torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC"),
                    user_id: [user._id]
                }));
            }

            return true;
        } else return false;
    },

    remove_torrent_in: function(id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        check(id, String);

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
