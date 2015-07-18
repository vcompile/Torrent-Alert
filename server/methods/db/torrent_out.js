Meteor.methods({

    remove_torrent_out: function(id) {
        this.unblock();

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
    }

});
