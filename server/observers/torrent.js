Meteor.setTimeout(function() {
  _worker.find({
    status: "",
    type: {
      $in: ["schedule", "search", "torrent"]
    }
  }).observe({
    added: function(row) {
      _torrentz_worker(row._id);
    }
  });
}, 1000);
