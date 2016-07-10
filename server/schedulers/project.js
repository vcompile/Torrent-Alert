var fibers = Npm.require("fibers");

Meteor.setInterval(function() {
  new fibers(function() {
    _project.find({
      worker: 'schedule',
    }, {
      fields: {
        _id: 1,
      },
    }).forEach(function(project) {
      if (!_worker.findOne({
          input: project._id,
          status: {
            $in: ['', '200'],
          },
          update_time: {
            $gt: moment().subtract(6, 'hours').toDate(),
          },
        }, {
          fields: {
            _id: 1,
          },
        })) {
        _worker.insert({
          input: project._id,
          insert_time: moment().toDate(),
          status: '',
          type: 'schedule',
        });
      }
    });
  }).run();
}, 1000 * 60 * 5);
