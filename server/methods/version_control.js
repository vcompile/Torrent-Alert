Meteor.methods({

    version_control: function() {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        // server

        var _torrent_worker = torrent_worker.find({
            status: "UP"
        }).fetch();

        torrent_in.update({
            status: {
                $eq: "OK"
            },
            user_id: user._id
        }, {
            $set: {
                status: moment().format(),
                torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC")
            }
        }, {
            multi: true
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
