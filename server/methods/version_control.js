Meteor.methods({

    version_control: function() {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user notFound");

        // server

        torrent_in.find({
            user_id: user._id
        }).fetch().forEach(function(item) {
            torrent_in_worker(item._id);
        });

        // device

        var record = {
            torrent_in: [],
            torrent_out: []
        };

        record.torrent_in = _.map(torrent_in.find({
            user_id: this.userId
        }, {
            fields: {
                _id: 1
            }
        }).fetch(), function(item) {
            return item._id;
        });

        record.torrent_out = _.map(torrent_out.find({
            hidden: {
                $ne: this.userId
            },
            torrent_in: {
                $in: record.torrent_in
            }
        }, {
            fields: {
                _id: 1
            }
        }).fetch(), function(item) {
            return item._id;
        });

        return record;
    }

});
