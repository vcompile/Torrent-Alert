Meteor.methods({

    insert_comment: function(item) {
        this.unblock();

        check(item, {
            _id: String,
            comment: String
        });

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        var row = torrent_out.findOne({
            _id: item._id
        });

        if (row) {
            var A = item.comment.replace(/\s+/g, " ").trim()

            if (A.length) {
                return torrent_out.update({
                    _id: row._id
                }, {
                    $push: {
                        commentz: {
                            $each: [A],
                            $position: 0
                        }
                    }
                });
            } else throw new Meteor.Error(422, "empty comment");
        } else return "notFound";
    },

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
