Meteor.methods({

    insert_torrent_in: function(input) {
        this.unblock();

        check(input, {
            keyword: String,
            age: Match.Integer,
            peers: Match.Integer,
            seeds: Match.Integer,
            urlPart: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        if (torrent_in.find({
                user_id: user._id
            }).count() < 4) {
            var row = _.pick(input, "keyword", "age", "peers", "seeds", "urlPart");

            if (torrent_in.findOne(row)) {
                torrent_in.update(row, {
                    $addToSet: {
                        user_id: user._id
                    }
                }, {
                    multi: true
                });
            } else {
                row.time = moment().format();
                row.user_id = [user._id];
                row._id = torrent_in.insert(row);

                torrent_in_http_proxy_request(row);
            }

            return true;
        } else return false;
    },

    remove_torrent_in: function(id) {
        this.unblock();

        check(id, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        if (torrent_in.findOne({
                _id: id,
                user_id: user._id
            })) {
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
