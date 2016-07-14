_worker.find({
  status: '',
  type: {
    $in: ['schedule', 'search', 'torrent'],
  },
}, {
  fields: {
    input: 1,
    insert_time: 1,
    type: 1,
  },
}).observe({
  added: function(row) {
    Meteor.setTimeout(function() {
      _torrentz_worker(row);
    }, 200);
  },
});
