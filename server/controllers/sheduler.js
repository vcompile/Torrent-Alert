Meteor.setInterval(function() {
    new fibers(function() {
        _project.find({
            worker: "schedule"
        }).fetch().forEach(function(item) {
            if (6 < moment.duration(moment().diff(moment(item.time))).asHours()) {
                if (!_worker.findOne({
                        project: item._id,
                        status: "",
                        type: item.worker
                    })) {
                    _worker.insert({
                        project: item._id,
                        status: "",
                        time_insert: moment().format(),
                        type: item.worker,
                        user: item.user
                    });
                }

                _project.update({
                    _id: item._id
                }, {
                    $set: {
                        time: moment().format()
                    }
                });
            }
        });
    }).run();
}, 1000 * 60 * 60);
