_torrent_instance = {};
_torrent_queue = {};

_torrentz_worker = function(worker_id) {
  var worker = _worker.findOne({
    _id: worker_id
  });

  if (worker) {
    if (!_.has(_torrent_instance, worker.project)) {
      _torrent_instance[worker.project] = "";
    }

    _key_value(_torrent_queue, [worker.project, (worker.type == "torrent" ? worker.torrent : "#")], {
      worker_id: worker._id
    });
  }

  if (_torrent_instance[worker.project] == "") {
    _torrent_instance[worker.project] = "#";

    while (_.size(_torrent_queue[worker.project])) {
      var key = _.keys(_torrent_queue[worker.project])[0];

      var row = (key == "#" ? _project.findOne({
        _id: worker.project
      }) : _torrent.findOne({
        _id: key
      }));

      var response = HTTP.call("GET", "http://do.vcompile.com/proxy/get.php", {
        params: {
          url: "https://torrentz-proxy.com/" + row.url + (key == "#" ? "?q=" + row.keyword + " added<" + row.within + "m leech>" + row.leech + " seed>" + row.seed : "")
        },
        timeout: 1000 * 60
      });

      if (response.statusCode === 200) {
        if (80 < response.content.length) {
          $ = Meteor.npmRequire("cheerio").load(response.content);

          if (key == "#") {
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
                    $set: torrent
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

                if (worker.type == "schedule") {
                  row.user.forEach(function(A) {
                    if (_push.find({
                        date: moment().format("YYYY-MM-DD"),
                        project: row._id,
                        user: A
                      }).count() < 10) {
                      if (!_push.findOne({
                          project: row._id,
                          url: torrent.url,
                          user: A
                        })) {
                        Push.send({
                          from: "TorrentAlert",
                          notId: _push.find({
                            user: A
                          }).count(),
                          query: {
                            userId: A
                          },
                          text: torrent.title,
                          title: row.keyword
                        });

                        _push.insert({
                          date: moment().format("YYYY-MM-DD"),
                          project: row._id,
                          url: torrent.url,
                          user: A
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
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
          }
        } else {
          console.log("80", worker.type, row, response);
        }
      } else {
        console.log("200", worker.type, row, response);
      }

      _worker.update((key == "#" ? {
        _id: _torrent_queue[worker.project][key].worker_id
      } : {
        project: worker.project,
        torrent: key
      }), {
        $set: {
          status: "200",
          time_update: moment().format()
        }
      }, {
        multi: true
      });

      delete _torrent_queue[worker.project][key];
    }

    _torrent_instance[worker.project] = "";
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
      _torrentz_worker(row._id);
    });
  }
});
