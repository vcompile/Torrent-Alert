_recent = [];

Meteor.methods({

  recent: function(query) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    _recent.forEach(item => {
      _worker.upsert({
        input: item._id,
        status: '',
        type: 'search',
      }, {
        $set: {
          input: item._id,
          insert_time: moment().toDate(),
          status: '',
          type: 'search',
        },
      });
    });

    return _recent;
  },

});
