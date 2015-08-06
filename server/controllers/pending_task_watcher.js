Meteor.setInterval(function() {
    new fibers(function() {

        var _torrent_worker = torrent_worker.find({
            status: "UP"
        }).fetch();

        torrent_in.find({
            status: {
                $ne: "OK"
            }
        }).forEach(function(row) {
            if (ping_interval < Math.floor(moment.duration(moment().diff(moment(row.status))).asMinutes())) {
                torrent_worker.update({
                    _id: row.torrent_worker
                }, {
                    $set: {
                        status: "DOWN"
                    }
                });

                torrent_in.update({
                    _id: row._id
                }, {
                    $set: {
                        status: moment().format(),
                        torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC")
                    }
                });
            }
        });

        torrent_out.find({
            status: {
                $ne: "OK"
            }
        }).forEach(function(row) {
            if (ping_interval < Math.floor(moment.duration(moment().diff(moment(row.status))).asMinutes())) {
                torrent_worker.update({
                    _id: row.torrent_worker
                }, {
                    $set: {
                        status: "DOWN"
                    }
                });

                torrent_out.update({
                    _id: row._id
                }, {
                    $set: {
                        status: moment().format(),
                        torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC")
                    }
                });
            }
        });

    }).run();
}, 1000 * 60);
