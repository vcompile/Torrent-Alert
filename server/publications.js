Meteor.publish("project", function() {
    return _project.find({
        user: this.userId
    }, {
        fields: {
            user: false
        },
        sort: {
            time: -1
        }
    });
});

Meteor.publish("torrent", function() {
    return _torrent.find({
        user: this.userId
    }, {
        fields: {
            user: false
        },
        sort: {
            time: -1
        }
    });
});
