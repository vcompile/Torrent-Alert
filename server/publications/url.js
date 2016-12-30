Meteor.publish('url', (input) => {
  check(input, [String]);

  return _url.find({
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
    // limit: 15,
  });
});
