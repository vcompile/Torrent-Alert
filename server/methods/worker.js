Meteor.methods({

    worker: function(data) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        if (user._id != "HedCET")
            throw new Meteor.Error(422, "restrictedAccess");

        var query = _.pick(data, "_id", "db", "std_out", "url");

        switch (data.db) {
            case "torrent_in":
                var row = torrent_in.findOne({
                    _id: data._id
                });

                if (row) {
                    var cheerio = Meteor.npmRequire("cheerio");
                    $ = cheerio.load(data.std_out);

                    $(".torrents dl").each(function(index, element) {
                        if ($(this).find("dt a").attr("href")) {
                            var torrent = {};

                            torrent["url"] = url + $(this).find("dt a").attr("href");
                            torrent["title"] = $(this).find("dt a").text().trim().replace(/\s+/g, " ");
                            torrent["category"] = $(this).find("dt").children().remove().end().text().replace(/[^0-9a-zA-Z]/g, " ").trim().replace(/\s+/g, " ");
                            torrent["verified"] = $(this).find("dd .v").text().replace(/[^0-9]/g, "");
                            torrent["time"] = $(this).find("dd .a span").attr("title") ? moment($(this).find("dd .a span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").format("X") : moment().format("X");
                            torrent["size"] = $(this).find("dd .s").text().replace(/[^0-9a-zA-Z]/g, " ").trim().replace(/\s+/g, " ");
                            torrent["peers"] = $(this).find("dd .u").text().replace(/[^0-9]/g, "");
                            torrent["seeds"] = $(this).find("dd .d").text().replace(/[^0-9]/g, "");

                            var _torrent_worker = torrent_worker.find().fetch();

                            torrent["linkz"] = [];
                            torrent["status"] = moment().format();
                            torrent["torrent_worker"] = (_torrent_worker.length ? _torrent_worker[Math.floor(Math.random() * _torrent_worker.length)] : "MAC");

                            // db

                            var _torrent_out = torrent_out.find({
                                url: torrent.url
                            });

                            if (_torrent_out.count() <= 0) {
                                torrent.torrent_in = [row._id];

                                var torrent_out_id = torrent_out.insert(torrent);

                                if (row.peers <= torrent.peers && row.seeds <= torrent.seeds) {
                                    row.user_id.forEach(function(userId) {
                                        Push.send({
                                            from: "Torrent Alert",
                                            title: "New Entry in " + row.keyword,
                                            text: torrent.title,
                                            query: {
                                                userId: userId
                                            }
                                        });

                                        torrent_push.insert({
                                            torrent_in: row._id,
                                            torrent_out: torrent_out_id,
                                            user_id: userId
                                        })
                                    });
                                }
                            } else {
                                _torrent_out.fetch().forEach(function(item) {
                                    torrent_out.update({
                                        _id: item._id
                                    }, {
                                        $addToSet: {
                                            torrent_in: row._id
                                        },
                                        $set: {
                                            category: torrent.category,
                                            verified: torrent.verified,
                                            peers: torrent.peers,
                                            seeds: torrent.seeds
                                        }
                                    });

                                    if (row.peers <= torrent.peers && row.seeds <= torrent.seeds) {
                                        row.user_id.forEach(function(userId) {
                                            if (torrent_push.find({
                                                    torrent_in: row._id,
                                                    torrent_out: item._id,
                                                    user_id: userId
                                                }).count() == 0) {

                                                Push.send({
                                                    from: "Torrent Alert",
                                                    title: "New Entry in " + row.keyword,
                                                    text: torrent.title,
                                                    query: {
                                                        userId: userId
                                                    }
                                                });

                                                torrent_push.insert({
                                                    torrent_in: row._id,
                                                    torrent_out: item._id,
                                                    user_id: userId
                                                })
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else console.log("notFound", data);
                break;

            case "torrent_out":
                var row = torrent_out.findOne({
                    _id: data._id
                });

                if (row) {
                    var linkz = [];

                    var cheerio = Meteor.npmRequire("cheerio");
                    $ = cheerio.load(data.std_out);

                    $(".download dl").each(function(index, element) {
                        if ($(this).find("dt a").attr("href")) {
                            var link = $(this).find("dt a").attr("href");

                            if (link.substr(0, 4) == "http") {
                                link = link.split("//", 2)[1];

                                if (link.substr(0, 4) == "www.")
                                    link = link.substr(4);

                                linkz.push({
                                    text: link.split("/", 1).toString("utf-8"),
                                    time: ($(this).find("dd span").attr("title") ? moment($(this).find("dd span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").format("X") : moment().format("X")),
                                    url: "//" + link
                                });
                            }
                        }
                    });

                    torrent_out.update({
                        _id: row._id
                    }, {
                        $set: {
                            linkz: linkz,
                        }
                    });
                } else console.log("notFound", data);
                break;
        }

    }

});
