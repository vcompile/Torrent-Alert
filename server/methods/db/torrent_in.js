Meteor.methods({

    insert_torrent_in: function(input) {
        this.unblock();

        check(input, {
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
            var input = _.pick(input, "keyword", "peers", "seeds", "urlPart");

            if (torrent_in.findOne(input)) {
                torrent_in.update(input, {
                    $addToSet: {
                        user_id: user._id
                    }
                }, {
                    multi: true
                });
            } else {
                input.time = moment().format();
                input.user_id = [user._id];
                input._id = torrent_in.insert(input);

                torrent_in_http_proxy_request(input);
            }

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
