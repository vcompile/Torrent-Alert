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
        user: this.userId,
        user_removed: {
            $ne: this.userId
        }
    }, {
        fields: {
            user: false,
            user_removed: false
        },
        sort: {
            time: -1
        }
    });
});

Meteor.publish("worker", function() {
    return _worker.find({
        status: "",
        user: this.userId
    }, {
        fields: {
            user: false
        }
    });
});
