_recent = [];

Meteor.methods({

  recent: function(input) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    return _recent;
  },

});
