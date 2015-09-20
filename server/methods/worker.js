torrent_in_worker = function(id) {
    var row = torrent_in.findOne({
        _id: id
    });

    if (row) {
        if (row.user_id.length) {
            exec("curl -L --proxy " + opt.proxy + " --proxy-user " + opt.proxy_user + " " + opt.url + "/" + row.urlPart + "?q=" + encodeURIComponent(row.keyword), function(error, std_out, std_error) {
                new fibers(function() {
                    if (error) {
                        console.log(row, error);
                    } else {
                        var cheerio = Meteor.npmRequire("cheerio");
                        $ = cheerio.load(std_out);

                        $(".results dl").each(function(index, element) {
                            if ($(this).find("dt a").attr("href")) {
                                var torrent = {};

                                torrent["urlPart"] = $(this).find("dt a").attr("href");
                                torrent["title"] = $(this).find("dt a").text().replace(/\s+/g, " ").trim();
                                torrent["category"] = $(this).find("dt").children().remove().end().text().replace(/[^0-9a-zA-Z]/g, " ").replace(/\s+/g, " ").trim();
                                torrent["time"] = $(this).find("dd .a span").attr("title") ? moment($(this).find("dd .a span").attr("title").replace(/\s+/g, " ").trim(), "ddd, DD MMM YYYY HH:mm:ss").format("X") : moment().format("X");
                                torrent["size"] = $(this).find("dd .s").text().replace(/[^0-9a-zA-Z]/g, " ").replace(/\s+/g, " ").trim();
                                torrent["peers"] = $(this).find("dd .u").text().replace(/[^0-9]/g, "");
                                torrent["seeds"] = $(this).find("dd .d").text().replace(/[^0-9]/g, "");

                                torrent["hidden"] = [];
                                torrent["linkz"] = [];
                                torrent["commentz"] = [];

                                var _torrent_out = torrent_out.find({
                                    urlPart: torrent.urlPart
                                });

                                if (_torrent_out.count() == 0) {
                                    torrent.torrent_in = [row._id];

                                    var torrent_out_id = torrent_out.insert(torrent);

                                    if (row.peers <= torrent.peers && row.seeds <= torrent.seeds) {
                                        row.user_id.forEach(function(userId) {
                                            if (torrent_push.find({
                                                    torrent_in: row._id,
                                                    torrent_out: torrent_out_id,
                                                    user_id: userId
                                                }).count() == 0) {

                                                Push.send({
                                                    from: "Torrent Alert",
                                                    query: {
                                                        userId: userId
                                                    },
                                                    text: torrent.title,
                                                    title: row.keyword
                                                });

                                                torrent_push.insert({
                                                    torrent_in: row._id,
                                                    torrent_out: torrent_out_id,
                                                    user_id: userId
                                                });

                                            }
                                        });
                                    }

                                    torrent_out_worker(torrent_out_id);
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
                                                        query: {
                                                            userId: userId
                                                        },
                                                        text: torrent.title,
                                                        title: row.keyword
                                                    });

                                                    torrent_push.insert({
                                                        torrent_in: row._id,
                                                        torrent_out: item._id,
                                                        user_id: userId
                                                    });

                                                }
                                            });
                                        }

                                        torrent_out_worker(item._id);
                                    });
                                }
                            }
                        });
                    }
                }).run();
            });
        } else {
            torrent_in.remove({
                _id: row._id
            });

            torrent_out.find({
                torrent_in: row._id
            }).forEach(function(A) {
                torrent_out.update({
                    _id: A._id
                }, {
                    $pull: {
                        torrent_in: row._id
                    }
                });
            });
        }
    }
};

torrent_out_worker = function(id) {
    var row = torrent_out.findOne({
        _id: id
    });

    if (row) {
        if (row.torrent_in.length) {
            var _user_id = [];

            row.torrent_in.forEach(function(id) {
                var A = torrent_in.findOne({
                    _id: id
                });

                _user_id = _user_id.concat(A.user_id);
            });

            if (_.difference(_.uniq(_user_id), row.hidden).length) {
                exec("curl -L --proxy " + opt.proxy + " --proxy-user " + opt.proxy_user + " " + opt.url + row.urlPart, function(error, std_out, std_error) {
                    new fibers(function() {
                        if (error) {
                            console.log(row, error);
                        } else {
                            var linkz = [];

                            var cheerio = Meteor.npmRequire("cheerio");
                            $ = cheerio.load(std_out);

                            $(".download dl").each(function(index, element) {
                                if ($(this).find("dt a").attr("href")) {
                                    var link = $(this).find("dt a").attr("href");

                                    if (link.substr(0, 4) == "http") {
                                        link = link.split("//", 2)[1];

                                        if (link.substr(0, 4) == "www.") {
                                            link = link.substr(4);
                                        }

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
                                    linkz: _.sortBy(linkz, "time")
                                }
                            });
                        }
                    }).run();
                });
            } else {
                torrent_out.remove({
                    _id: row._id
                });
            }
        } else {
            torrent_out.remove({
                _id: row._id
            });
        }
    }
};
