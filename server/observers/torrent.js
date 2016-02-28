_worker.find({
  status: "",
  type: {
    $in: ["schedule", "search", "torrent"]
  }
}).observe({
  added: function(row) {
    Meteor.setTimeout(function() {
      _torrentz_worker(row._id);
    });
  }
});
