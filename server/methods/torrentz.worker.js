_torrentz_worker = {};

_torrentz = function(type) {
    if (!_.has(_torrentz_worker, type)) {
        _torrentz_worker[type] = {
            status: ""
        }
    }

    if (_torrentz_worker[type].status == "") {
        _torrentz_worker[type].status = moment().format();

        while (_torrentz_worker[type].row = _worker.findOne({
                status: "",
                type: type
            }, {
                sort: {
                    time_insert: -1
                }
            })) {
            _worker.update({
                _id: _torrentz_worker[type].row._id
            }, {
                $set: {
                    status: "#",
                    time_update: moment().format()
                }
            });

            var row = (type == "torrent" ? _torrent.findOne({
                _id: _torrentz_worker[type].row.torrent
            }) : _project.findOne({
                _id: _torrentz_worker[type].row.project
            }));

            var response = HTTP.call("GET", "http://proxy.vcompile.com/get.php", {
                params: {
                    url: "https://torrentz.eu/" + row.url + (type == "torrent" ? "" : "?q=" + row.keyword + " added<" + row.within + "m leech>" + row.leech + " seed>" + row.seed)
                },
                timeout: 1000 * 60
            });

            if (response.statusCode === 200) {
                if (80 < response.content.length) {
                    $ = Meteor.npmRequire("cheerio").load(response.content);

                    if (type == "torrent") {
                        var link = [];

                        $(".download dl").each(function() {
                            if ($(this).find("dt a").attr("href")) {
                                var url = $(this).find("dt a").attr("href");

                                if (url.substr(0, 4) == "http") {
                                    link.push({
                                        text: url.replace(/^http(s)?:\/\/(www\.)?/, '').split("/", 1).toString(),
                                        time: ($(this).find("dd span").attr("title") ? moment($(this).find("dd span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").format() : moment().format()),
                                        url: url
                                    });
                                }
                            }
                        });

                        _torrent.update({
                            _id: row._id
                        }, {
                            $set: {
                                link: _.sortBy(link, "time").reverse()
                            }
                        });
                    } else {
                        $(".results dl").each(function() {
                            if ($(this).find("dt a").attr("href")) {
                                var torrent = {};

                                torrent.url = $(this).find("dt a").attr("href").replace(/[^0-9a-z]/gi, "");
                                torrent.title = $(this).find("dt a").text().replace(/\s+/g, " ").trim();
                                torrent.category = $(this).find("dt").children().remove().end().text().replace(/[^0-9a-z]/gi, " ").replace(/\s+/g, " ").trim();
                                torrent.time = ($(this).find("dd .a span").attr("title") ? moment($(this).find("dd .a span").attr("title").replace(/\s+/g, " ").trim(), "ddd, DD MMM YYYY HH:mm:ss").format() : moment().format());
                                torrent.size = $(this).find("dd .s").text().replace(/[^0-9a-z]/gi, "");
                                torrent.leech = $(this).find("dd .u").text().replace(/[^0-9]/g, "");
                                torrent.seed = $(this).find("dd .d").text().replace(/[^0-9]/g, "");

                                var item = _torrent.findOne({
                                    url: torrent.url
                                });

                                if (item) {
                                    _torrent.update({
                                        _id: item._id
                                    }, {
                                        $addToSet: {
                                            user: {
                                                $each: row.user
                                            }
                                        },
                                        $set: {
                                            category: torrent.category,
                                            leech: torrent.leech,
                                            seed: torrent.seed,
                                            size: torrent.size
                                        }
                                    });

                                    if (!_worker.findOne({
                                            status: "",
                                            torrent: item._id,
                                            type: "torrent"
                                        })) {
                                        _worker.insert({
                                            project: row._id,
                                            status: "",
                                            torrent: item._id,
                                            time_insert: moment().format(),
                                            type: "torrent",
                                            user: row.user
                                        });
                                    }

                                    _project.update({
                                        _id: row._id
                                    }, {
                                        $addToSet: {
                                            torrent: item._id
                                        }
                                    });
                                } else {
                                    torrent.link = [];
                                    torrent.user = row.user;

                                    torrent._id = _torrent.insert(torrent);

                                    if (!_worker.findOne({
                                            status: "",
                                            torrent: torrent._id,
                                            type: "torrent"
                                        })) {
                                        _worker.insert({
                                            project: row._id,
                                            status: "",
                                            torrent: torrent._id,
                                            time_insert: moment().format(),
                                            type: "torrent",
                                            user: row.user
                                        });
                                    }

                                    _project.update({
                                        _id: row._id
                                    }, {
                                        $addToSet: {
                                            torrent: torrent._id
                                        }
                                    });
                                }

                                if (type == "schedule") {
                                    row.user.forEach(function(A) {
                                        if (!_push.findOne({
                                                project: row._id,
                                                url: torrent.url,
                                                user: A
                                            })) {
                                            Push.send({
                                                from: "TorrentAlert",
                                                notId: _push.find().count(),
                                                query: {
                                                    userId: A
                                                },
                                                text: torrent.title,
                                                title: row.keyword
                                            });

                                            _push.insert({
                                                project: row._id,
                                                url: torrent.url,
                                                user: A
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                } else {
                    console.log("80", _torrentz_worker[type], row, response);
                }
            } else {
                console.log("200", _torrentz_worker[type], row, response);
            }

            _worker.update({
                _id: _torrentz_worker[type].row._id
            }, {
                $set: {
                    status: "200",
                    time_update: moment().format()
                }
            });
        }

        _torrentz_worker[type].status = "";
    }
};

_worker.find({
    status: "",
    type: {
        $in: ["schedule", "search", "torrent"]
    }
}).observe({
    added: function(row) {
        Meteor.setTimeout(function() {
            _torrentz(row.type);
        });
    }
});
