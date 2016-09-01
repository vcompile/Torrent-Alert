Meteor.methods({

  refresh_project: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, String);

    var project = _project.findOne({
      _id: input
    }, {
      fields: {
        worker: 1,
      },
    });

    _worker.upsert({
      input: project._id,
      status: '',
      type: project.worker,
    }, {
      $set: {
        input: project._id,
        time: moment().toDate(),
        status: '',
        type: project.worker,
      },
    });

    return 'refreshing';
  },

  remove_project: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, [String]);

    var A = _project.update({
      _id: {
        $in: input,
      },
    }, {
      $pull: {
        user: user._id,
      },
    }, {
      multi: true,
    });

    return (A ? A + ' item ' : '') + 'removed';
  },

  restore_project: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, [String]);

    var A = _project.update({
      _id: {
        $in: input,
      },
    }, {
      $addToSet: {
        user: user._id,
      },
    }, {
      multi: true,
    });

    return (A ? A + ' item ' : '') + 'restored';
  },

  schedule_project: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, String);

    var project = _project.findOne({
      _id: input
    }, {
      fields: {
        query: 1,
      },
    });

    if (project) {
      var exists = _project.findOne({
        query: project.query,
        worker: 'schedule',
      }, {
        fields: {
          _id: 1,
        },
      });

      if (exists) {
        var A = _project.update({
          _id: exists._id,
        }, {
          $addToSet: {
            user: user._id,
          },
        });

        return {
          text: (A ? A + ' item ' : '') + 'scheduled',
          project: exists._id,
        };
      } else {
        var A = _project.update({
          _id: project._id,
        }, {
          $addToSet: {
            user: user._id,
          },
          $set: {
            worker: 'schedule',
          },
        });

        return {
          text: (A ? A + ' item ' : '') + 'scheduled',
        };
      }
    } else {
      return {
        text: 'itemNotFound',
      };
    }
  },

  search_project: function(input) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, Match.Where(function(A) {
      return A.match(/\?f=(.+) added/);
    }));

    var project = _project.findOne({
      query: input,
      worker: 'search',
    }, {
      fields: {
        _id: 1,
      },
    });

    if (project) {
      _worker.upsert({
        input: project._id,
        status: '',
        type: 'search',
      }, {
        $set: {
          input: project._id,
          time: moment().toDate(),
          status: '',
          type: 'search',
        },
      });

      return project._id;
    } else {
      var project_id = _project.insert({
        index: _project.find({}, { fields: { _id: 1 } }).count() + 1,
        query: input,
        title: input.match(/\?f=(.+) added/)[1],
        worker: 'search',
      });

      _worker.upsert({
        input: project_id,
        status: '',
        type: 'search',
      }, {
        $set: {
          input: project_id,
          time: moment().toDate(),
          status: '',
          type: 'search',
        },
      });

      return project_id;
    }
  },

});
