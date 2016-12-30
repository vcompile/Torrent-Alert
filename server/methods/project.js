const moment = require('moment');

Meteor.methods({

  insert_project(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, { query: String, title: String });

    let project = _project.findOne({
      query: input.query,
    }, {
      fields: { error: true, query: true },
    });

    if (project) {
      if (['', 'noItemFound'].indexOf(project.error) == -1) {
        _project.update({
          _id: project._id,
        }, {
          $set: {
            error: '',
          },
        });
      }

      let worker = _worker.findOne({
        query: project.query,
      }, {
        fields: {
          status: true,
          time: true,
        },
      });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update({
            _id: worker._id,
          }, {
            $set: {
              status: '',
              time: moment().toDate(),
            },
          });
        }
      } else {
        _worker.insert({
          query: project.query,
          status: '',
          time: moment().toDate(),
          type: 'project',
        });
      }

      return project._id;
    } else {
      let project_id = _project.insert(_.extend(input, { error: '' }));

      _worker.insert({
        query: input.query,
        status: '',
        time: moment().toDate(),
        type: 'project',
      });

      return project_id;
    }
  },

  trigger_project(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    let project = _project.findOne({
      _id: input,
    }, {
      fields: { error: true, query: true },
    });

    if (project) {
      if (['', 'noItemFound'].indexOf(project.error) == -1) {
        _project.update({
          _id: project._id,
        }, {
          $set: {
            error: '',
          },
        });
      }

      let worker = _worker.findOne({
        query: project.query,
      }, {
        fields: {
          status: true,
          time: true,
        },
      });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update({
            _id: worker._id,
          }, {
            $set: {
              status: '',
              time: moment().toDate(),
            },
          });
        }
      } else {
        _worker.insert({
          query: project.query,
          status: '',
          time: moment().toDate(),
          type: 'project',
        });
      }

      return project._id;
    } else {
      throw new Meteor.Error(422, "notFound");
    }
  },

});
