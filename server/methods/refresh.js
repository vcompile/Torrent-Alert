Meteor.methods({

  refresh: function(id) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(id, String);

    var row = _project.findOne({
      _id: id
    });

    if (row) {
      _project.update({
        _id: row._id
      }, {
        $set: {
          time: moment().format()
        }
      });

      if (!_worker.findOne({
          project: row._id,
          status: "",
          type: row.worker
        })) {
        _worker.insert({
          project: row._id,
          status: "",
          time_insert: moment().format(),
          type: row.worker,
          user: row.user
        });
      }

      return row;
    } else throw new Meteor.Error(422, "itemNotFound");
  }

});
