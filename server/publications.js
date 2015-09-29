Meteor.publish("torrent_in", function() {
    return torrent_in.find({
        user_id: this.userId
    }, {
        fields: {
            keyword: 1,
            age: 1,
            peers: 1,
            seeds: 1,
            urlPart: 1
        },
        sort: {
            time: -1
        }
    });
});

Meteor.publish("torrent_out", function(query) {
    check(query, {
        torrent_in: [String]
    });

    return torrent_out.find({
        hidden: {
            $ne: this.userId
        },
        torrent_in: {
            $in: query.torrent_in
        }
    }, {
        fields: {
            category: 1,
            linkz: 1,
            peers: 1,
            seeds: 1,
            size: 1,
            time: 1,
            title: 1,
            torrent_in: 1
        },
        sort: {
            time: -1
        }
    });
});
