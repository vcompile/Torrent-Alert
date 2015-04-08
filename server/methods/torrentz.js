Meteor.methods({

    downloadLinkz: function(_id) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "user N");

        var row = torrent_out.findOne({
            _id: _id
        });

        if (row) {
            var torrentzHttpResponse = HTTP.get(row.url, {
                headers: {
                    "User-Agent": useragents[Math.floor(Math.random() * useragents.length)]
                },
                timeout: 1000 * 60 * 5
            });

            if (torrentzHttpResponse.statusCode === 200) {
                var linkz = [];

                var cheerio = Meteor.npmRequire("cheerio");
                $ = cheerio.load(torrentzHttpResponse.content);

                $(".download dl").each(function(index, element) {
                    if ($(this).find("dt a").attr("href")) {
                        var link = $(this).find("dt a").attr("href");

                        if (link.substr(0, 4) == "http") {
                            link = link.split("//", 2)[1];

                            if (link.substr(0, 4) == "www.")
                                link = link.substr(4);

                            linkz.push({
                                fromNow: ($(this).find("dd span").attr("title") ? moment($(this).find("dd span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").fromNow() : moment().fromNow()),
                                text: link.split("/", 1).toString("utf-8"),
                                url: "//" + link
                            });
                        }
                    }
                });

                return linkz;
            }
        }
    }

});
