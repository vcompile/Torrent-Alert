Meteor.methods({

    remove_torrent_out: function(id) {
        this.unblock();

        check(id, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user notFound");

        var row = torrent_out.findOne({
            _id: id
        });

        if (row) {
            return torrent_out.update({
                _id: row._id
            }, {
                $addToSet: {
                    hidden: user._id
                }
            });
        } else return "notFound";
    },

    update_click_count: function(item) {
        this.unblock();

        check(item, {
            id: String,
            url: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user notFound");

        var row = torrent_out.findOne({
            _id: item.id
        });

        if (row) {
            return torrent_out.update({
                _id: row._id,
                "linkz.url": item.url
            }, {
                $inc: {
                    "linkz.$.click_count": 1
                }
            });
        } else return "notFound";
    }

});
