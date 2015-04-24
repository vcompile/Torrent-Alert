Meteor.publish("torrent_in", function() {
    if (this.userId == "linto") {
        return torrent_in.find();
    } else {
        return torrent_in.find({
            user_id: this.userId
        }, {
            fields: {
                keyword: 1,
                peers: 1,
                seeds: 1,
                url: 1,
                urlPart: 1
            },
            sort: {
                time: -1
            }
        });
    }
});

Meteor.publish("torrent_out", function(query) {
    if (this.userId == "linto") {
        return torrent_out.find();
    } else {
        return torrent_out.find({
            torrent_in: {
                $in: query.torrent_in
            }
        }, {
            fields: {
                category: 1,
                peers: 1,
                seeds: 1,
                size: 1,
                time: 1,
                title: 1,
                torrent_in: 1,
                url: 1,
                verified: 1
            },
            sort: {
                time: -1
            }
        });
    }
});
