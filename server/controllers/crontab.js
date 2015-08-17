Meteor.setInterval(function() {
    if (-1 < crontab_time.indexOf(moment().format("HH:mm"))) {
        new fibers(function() {

            var _torrent_worker = torrent_worker.find({
                status: "UP"
            }).fetch();

            torrent_in.find({
                status: {
                    $eq: "OK"
                }
            }, {
                $set: {
                    status: moment().format(),
                    torrent_worker: (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)]._id : "MAC")
                }
            }, {
                multi: true
            });

            torrent_out.find({
                status: {
                    $eq: "OK"
                },
            }).forEach(function(row) {
                if (Math.floor(moment.duration(moment().diff(moment(row.time, "X"))).asMonths()) > 24) {
                    torrent_out.remove({
                        _id: row._id
                    });
                }
            });

        }).run();
    }
}, 1000 * 60);
