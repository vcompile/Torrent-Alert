Meteor.publish('url', function(input) {
  check(input, [String]);

  return _url.find({
    torrent: {
      $in: input,
    },
  });
});
