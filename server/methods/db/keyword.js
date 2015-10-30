Meteor.methods({

    insert_keyword: function(input) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(input, {
            keyword: String,
            leech: Match.Integer,
            seed: Match.Integer,
            url: String,
            within: Match.Integer,
            worker: String
        });

        var A = true;

        if (input.worker == "schedule") {
            A = ((_project.find({
                user_id: user._id,
                worker: input.worker
            }).count() < 4) ? true : false);
        }

        if (A) {
            var row = _project.findOne(input);

            if (row) {
                var update_count = _project.update(input, {
                    $addToSet: {
                        user_id: user._id
                    },
                    time: moment().format()
                }, {
                    multi: true
                });

                if (input.worker == "search" && update_count && !_worker.findOne({
                        project: row._id,
                        status: "",
                        type: "project",
                        worker: input.worker
                    })) {
                    _worker.insert({
                        project: row._id,
                        status: "",
                        time_insert: moment().format(),
                        type: "project",
                        worker: input.worker
                    });
                }

                return update_count + " keyword updated";
            } else {
                input.time = moment().format();
                input.torrent = [];
                input.user_id = [user._id];

                input._id = _project.insert(input);

                if (!_worker.findOne({
                        project: input._id,
                        status: "",
                        type: "project",
                        worker: input.worker
                    })) {
                    _worker.insert({
                        project: input._id,
                        status: "",
                        time_insert: moment().format(),
                        type: "project",
                        worker: input.worker
                    });
                }

                return "1 keyword added";
            }
        } else return "quota limit reached";
    }

});
