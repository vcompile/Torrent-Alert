const moment = require('moment');

Meteor.methods({

  insert_keyword(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    input = '/suggestions.php?q=' + input;

    let worker = _worker.findOne({
      query: input,
    }, {
      fields: {
        status: true,
        time: true,
      },
    });

    if (worker) {
      if (worker.status != '200' || 3 < moment.duration(moment().diff(worker.time)).asDays()) {
        _worker.update({
          _id: worker._id,
        }, {
          $set: {
            status: '',
            time: moment().toDate(),
          },
        });
      }

      return worker._id;
    } else {
      return _worker.insert({
        project: [],
        query: input,
        status: '',
        time: moment().toDate(),
        type: 'keyword',
      });
    }
  },

});
