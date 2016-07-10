Meteor.publish('project', function(input) {
  check(input, Match.OneOf([String], undefined));

  if (input) {
    return _project.find({
      _id: {
        $in: input,
      },
    });
  } else {
    return _project.find({
      user: this.userId,
    });
  }
});
