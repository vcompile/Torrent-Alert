Meteor.methods({

  insert_project: function(input) {
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
        user: user._id,
        worker: input.worker
      }).count() < 4) ? true : false);
    }

    if (A) {
      var row = _project.findOne(input);

      if (row) {
        var update_count = _project.update(input, {
          $addToSet: {
            user: user._id
          },
          $set: {
            time: moment().format()
          }
        }, {
          multi: true
        });

        if (input.worker == "search" && update_count && !_worker.findOne({
            project: row._id,
            status: "",
            type: input.worker
          })) {
          _worker.insert({
            project: row._id,
            status: "",
            time_insert: moment().format(),
            type: input.worker,
            user: row.user
          });
        }

        return row._id;
      } else {
        input.time = moment().format();
        input.torrent = [];
        input.user = [user._id];

        input._id = _project.insert(input);

        if (!_worker.findOne({
            project: input._id,
            status: "",
            type: input.worker
          })) {
          _worker.insert({
            project: input._id,
            status: "",
            time_insert: moment().format(),
            type: input.worker,
            user: input.user
          });
        }

        return input._id;
      }
    } else return "";
  },

  remove_project: function(id) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(id, String);

    var row = _project.findOne({
      _id: id,
      user: user._id
    });

    if (row) {
      if (row.user.length == 1 && row.worker == "schedule") {
        _project.remove({
          _id: row._id
        });
      } else {
        _project.update({
          _id: row._id
        }, {
          $pull: {
            user: user._id
          }
        });
      }

      return "1 keyword removed";
    } else return "notFound";
  },

  schedule_project: function(id) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(id, String);

    var exists = _project.findOne({
      _id: id,
      user: user._id
    });

    if (exists) {
      if (_project.find({
          user: user._id,
          worker: "schedule"
        }).count() < 4) {
        var schedule_exists = _project.findOne({
          keyword: exists.keyword,
          leech: exists.leech,
          seed: exists.seed,
          url: exists.url,
          user: user._id,
          within: exists.within,
          worker: "schedule"
        });

        if (schedule_exists) {
          _project.update({
            _id: schedule_exists._id,
          }, {
            $addToSet: {
              user: user._id
            },
          });
        } else {
          _project.update({
            _id: id,
            user: user._id
          }, {
            $set: {
              worker: "schedule"
            }
          });
        }

        return "1 item moved to scheduler";
      } else return "quota limit reached";
    } else return "notFound";
  }

});
