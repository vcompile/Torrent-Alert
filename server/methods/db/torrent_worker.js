Meteor.methods({

    ping_worker: function(_id) {
        this.unblock();

        if (_id) {
            check(_id, String);

            var row = torrent_worker.findOne({
                _id: _id
            });

            if (row) {
                return torrent_worker.update({
                    _id: _id
                }, {
                    $set: {
                        status: "UP",
                        time: moment().format()
                    }
                });
            } else {
                return torrent_worker.insert({
                    _id: _id,
                    status: "UP",
                    time: moment().format()
                });
            }
        } else return "empty";
    }

});
