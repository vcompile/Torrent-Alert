Meteor.subscribe("project");

subscribe_torrent = _.debounce(function() {
    Meteor.subscribe("torrent", {
        project: _.map(_project.find().fetch(), function(item) {
            return item._id;
        })
    });
}, 1000 * 4);

Meteor.subscribe("worker");
