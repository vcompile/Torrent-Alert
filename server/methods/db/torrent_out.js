Meteor.methods({

    remove_torrent_out: function(id) {
        this.unblock();

        check(id, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        var row = torrent_out.findOne({
            _id: id
        });

        if (row) {
            return torrent_out.update({
                _id: id
            }, {
                $addToSet: {
                    hidden: user._id
                }
            });
        } else return "notFound";
    },

    update_priority: function(item) {
        this.unblock();

        check(item, {
            _id: String,
            url: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        var row = torrent_out.findOne({
            _id: item._id
        });

        if (row) {
            return torrent_out.update({
                _id: item._id,
                "linkz.url": item.url
            }, {
                $inc: {
                    "linkz.$.priority": 1
                }
            });
        } else return "notFound";
    }

});
