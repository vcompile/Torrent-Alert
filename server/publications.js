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

Meteor.publish("torrent", function(input) {
    check(input, {
        project: [String]
    });

    return _torrent.find({
        project: {
            $in: input.project
        }
    }, {
        fields: {
            project: false
        },
        limit: 50,
        sort: {
            time: -1
        }
    });
});
