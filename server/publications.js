Meteor.publish("project", function() {
  return _project.find({
    user: this.userId
  }, {
    fields: {
      user: false
    },
    limit: 25,
    sort: {
      time: -1
    }
  });
});

Meteor.publish("torrent", function(input) {
  check(input, {
    field: String,
    id: String
  });

  var query = {
    user: this.userId
  };

  if (input.field == "torrent") {
    query._id = input.id;
  } else {
    query.project = input.id;
  }

  return _torrent.find(query, {
    fields: {
      project: false,
      user: false
    },
    limit: 250,
    sort: {
      time: -1
    }
  });
});

Meteor.publish("worker", function(project) {
  check(project, String);

  return _worker.find({
    project: project,
    status: "",
    user: this.userId
  }, {
    fields: {
      user: false
    },
    limit: 50,
    sort: {
      time_insert: -1
    }
  });
});
