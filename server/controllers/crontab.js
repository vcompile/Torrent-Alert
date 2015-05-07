Meteor.setInterval(function() {
    new fibers(function() {

        var _torrent_worker = torrent_worker.find({
            status: "UP"
        }).fetch();

        torrent_in.find({
            status: {
                $eq: "OK"
            }
        }).forEach(function(row) {
            torrent_in.update({
                _id: row._id
            }, {
                $set: {
                    status: moment().format(),
                    torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC")
                }
            });
        });

    }).run();
}, 1000 * 60 * 60 * 3);
