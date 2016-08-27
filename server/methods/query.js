Meteor.methods({

  query: function(query) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    check(query, String);

    var res = {},
      proxy = Random.choice(_proxy);

    try {
      var req = HTTP.call("GET", Random.choice(_torrentz_proxy) + query, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
        },
        npmRequestOptions: {
          proxy: proxy,
        },
        timeout: 1000 * 30,
      });

      if (req.statusCode === 200) {
        var $ = Meteor.npmRequire("cheerio").load(req.content);

        if (-1 < query.indexOf('?')) { // torrent
          res.count = +_.first($('.results h2').children().remove().end().text().split(/torrents/i)).replace(/[^0-9]/g, '');
          res.torrent = [];

          $(".results dl").each(function() {
            if ($(this).find("dt a").attr("href")) {
              res.torrent.push({

                title: $(this).find("dt a").text(),
                query: $(this).find("dt a").attr("href"),
                category: $(this).find("dt").children().remove().end().text().replace(/[^0-9a-z ]/gi, " ").trim().replace(/\s+/g, " "),

                insert_time: ($(this).find("dd span:nth-child(2)").attr("title") ? moment($(this).find("dd span:nth-child(2)").attr("title"), "X").toDate() : moment().toDate()),
                leech: +$(this).find("dd span:nth-child(4)").text().replace(/[^0-9]/g, ""),
                seed: +$(this).find("dd span:nth-child(5)").text().replace(/[^0-9]/g, ""),
                size: $(this).find("dd span:nth-child(3)").text().replace(/[^0-9a-z]/gi, ""),

              });
            }
          });

          // var reg_ex = new RegExp(/ ?((.*?) +\(([0-9]+)\)) +([0-9]+[a-z]+,?) ?/gi),
          //   text = $(".recent").text();

          // var A,
          //   Z = [];

          // while ((A = reg_ex.exec(text)) !== null) {
          //   if (A[2].length && +A[3]) {
          //     Z.push({
          //       title: A[2],
          //       count: +A[3],
          //     });
          //   }
          // }

          if (Z.length) {
            _recent = _.map(Z, item => {
              var project = _project.findOne({ query: '/search?f=' + item.title + ' added:90d' }, {
                fields: {
                  _id: 1,
                },
              });

              if (project) {
                item._id = project._id;
              } else {
                item._id = _project.insert({
                  count: item.count,
                  index: _project.find({}, { fields: { _id: 1 } }).count() + 1,
                  query: '/search?f=' + item.title + ' added:90d',
                  title: item.title,
                  worker: 'search',
                });
              }

              return item;
            });
          }
        } else { // url
          res.url = [];

          $(".download dl").each(function() {
            if ($(this).find("dt a").attr("href")) {
              var url = $(this).find("dt a").attr("href");

              if (url.substr(0, 4) == "http") {
                res.url.push({
                  insert_time: ($(this).find("dd span").attr("title") ? moment($(this).find("dd span").attr("title"), "ddd, DD MMM YYYY HH:mm:ss").toDate() : moment().toDate()),
                  url: url,
                });
              }
            }
          });
        }
      } else {
        console.log('query HTTP.call()', query);
      }
    } catch (e) {
      console.log(proxy, e);
    }

    return res;
  },

});
