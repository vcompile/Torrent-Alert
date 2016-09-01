Meteor.methods({

  query: function(query) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    check(query, String);

    var res = {},
      proxy = Random.choice(_proxy),
      torrentz_url = Random.choice(_torrentz_url) + query;

    try {
      var req = HTTP.call("GET", torrentz_url, {
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
          var count = ($('.results h2').length ? $('.results h2').text().match(/([0-9,]+)? Torrents/i) : null);
          res.count = (count && count[1] ? +count[1].replace(/[^0-9]+/, '') : null);

          res.torrent = [];

          $(".results dl").each(function() {
            if ($(this).find("dt a").attr("href")) {
              res.torrent.push({

                title: $(this).find('dt a').text(),
                query: $(this).find('dt a').attr('href'),
                category: $(this).find('dt').children().remove().end().text().replace(/»/g, '').trim(),

                verified: $(this).find('dd span:nth-child(1)').text().replace(/[^✓]+/g, ''),
                time: (moment($(this).find("dd span:nth-child(2)").attr("title"), ["ddd, DD MMM YYYY HH:mm:ss", "X"]).isValid() ? moment($(this).find("dd span:nth-child(2)").attr("title"), ["ddd, DD MMM YYYY HH:mm:ss", "X"]).toDate() : moment().toDate()),
                size: $(this).find('dd span:nth-child(3)').text().replace(/[^0-9a-z]+/gi, ''),
                leech: +$(this).find('dd span:nth-child(4)').text().replace(/[^0-9]+/g, ''),
                seed: +$(this).find('dd span:nth-child(5)').text().replace(/[^0-9]+/g, ''),

              });
            }
          });

          var recent = [];

          $('.recent a').each(function() {
            if ($(this).attr('href')) {
              recent.push({
                title: $(this).text(),
              });
            }
          });

          if (recent.length) {
            _recent = _.map(recent, item => {
              var project = _project.findOne({ query: '/search?f=' + item.title + ' added:90d' }, {
                fields: {
                  count: 1,
                },
              });

              if (project) {
                item._id = project._id;

                if (project.count) {
                  item.count = project.count;
                }
              } else {
                item._id = _project.insert({
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
              res.url.push({
                time: (moment($(this).find("dd span").attr("title"), ["ddd, DD MMM YYYY HH:mm:ss", "X"]).isValid() ? moment($(this).find("dd span").attr("title"), ["ddd, DD MMM YYYY HH:mm:ss", "X"]).toDate() : moment().toDate()),
                url: $(this).find("dt a").attr("href"),
              });
            }
          });
        }
      } else {
        console.log('query', proxy, torrentz_url, req);
      }
    } catch (e) {
      console.log('query', proxy, torrentz_url, e);
    }

    return res;
  },

});
