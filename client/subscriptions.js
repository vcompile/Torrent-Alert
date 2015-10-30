Meteor.subscribe("project");

subscribe_torrent = _.debounce(function() {
    Meteor.subscribe("torrent", {
        keyword: _.map(_torrent.find().fetch(), function(item) {
            return item._id;
        })
    });
}, 1000 * 4);

Meteor.subscribe("worker");
