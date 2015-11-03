Meteor.methods({

    remove_torrent: function(input) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(input, {
            torrent: [String]
        });

        _torrent.update({
            _id: {
                $in: input.torrent
            },
            user: user._id
        }, {
            $pull: {
                user: user._id
            }
        }, {
            multi: true
        });
    }

});
