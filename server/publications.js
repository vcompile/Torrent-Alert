Meteor.publish("torrent_in", function() {
    if (this.userId == "HedCET") {
        return torrent_in.find({
            status: {
                $ne: "OK"
            }
        }, {
            fields: {
                keyword: 1,
                status: 1,
                torrent_worker: 1,
                url: 1,
                urlPart: 1
            },
            sort: {
                time: -1
            }
        });
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
    if (this.userId == "HedCET") {
        return torrent_out.find({
            status: {
                $ne: "OK"
            }
        }, {
            fields: {
                status: 1,
                torrent_worker: 1,
                url: 1
            },
            sort: {
                time: -1
            }
        });
    } else {
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

Meteor.publish("torrent_worker", function(query) {
    if (this.userId == "HedCET") {
        return torrent_worker.find({}, {
            fields: {
                status: 1
            },
            sort: {
                time: -1
            }
        });
    }
});
