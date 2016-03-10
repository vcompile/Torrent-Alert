_worker.find({
  status: "",
  type: {
    $in: ["schedule", "search", "torrent"]
  }
}).observe({
  added: function(row) {
    Meteor.setTimeout(function() { // ASYNC
      _torrentz_worker(row._id);
    }, 1000);
  }
});
