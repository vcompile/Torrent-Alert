Meteor.publish('project', (input) => {
  check(input, [String]);

  return _project.find({
    _id: {
      $in: input,
    },
    deny: {
      $exists: false,
    },
  }, {
    fields: {
      deny: false,
    },
    limit: 15,
  });
});
