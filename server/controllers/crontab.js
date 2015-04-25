torrentz_query = function(urlPart, keyword, url) {
    var urlPart = (urlPart ? urlPart : "_"),
        keyword = (keyword ? keyword : "_"),
        url = (url ? url : "http://torrentz.in");

    var torrentzHttpResponse = HTTP.get(url + "/" + urlPart, {
        headers: {
            "User-Agent": useragents[Math.floor(Math.random() * useragents.length)]
        },
        params: {
            f: keyword
        },
        timeout: 1000 * 60 * 5
    });

    if (torrentzHttpResponse.statusCode === 200) {
        var torrentz = [];

        var cheerio = Meteor.npmRequire("cheerio");
        $ = cheerio.load(torrentzHttpResponse.content);

        $(".results dl").each(function(index, element) {
            if ($(this).find("dt a").attr("href")) {
                var torrent = {};

var _url = url + $(this).find("dt a").attr("href");

                torrent["url"] = url + $(this).find("dt a").attr("href");
                torrent["title"] = $(this).find("dt a").text().trim().replace(/\s+/g, " ");
                torrent["category"] = $(this).find("dt").children().remove().end().text().replace(/[^0-9a-zA-Z]/g, " ").trim().replace(/\s+/g, " ");
                torrent["verified"] = $(this).find("dd .v").text().replace(/[^0-9]/g, "");
                torrent["time"] = $(this).find("dd .a span").attr("title") ? moment($(this).find("dd .a span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").format("X") : moment().format("X");
                torrent["size"] = $(this).find("dd .s").text().replace(/[^0-9a-zA-Z]/g, " ").trim().replace(/\s+/g, " ");
                torrent["peers"] = $(this).find("dd .u").text().replace(/[^0-9]/g, "");
                torrent["seeds"] = $(this).find("dd .d").text().replace(/[^0-9]/g, "");

                torrent["status"] = "OK";
                torrent["download_linkz"] = [];

                var torrentzHttpResponse = HTTP.get(_url, {
                    headers: {
                        "User-Agent": useragents[Math.floor(Math.random() * useragents.length)]
                    },
                    timeout: 1000 * 60 * 5
                });

                if (torrentzHttpResponse.statusCode === 200) {
                    var linkz = [];

                    // var cheerio = Meteor.npmRequire("cheerio");
                    $ = cheerio.load(torrentzHttpResponse.content);

                    $(".download dl").each(function(index, element) {
                        if ($(this).find("dt a").attr("href")) {
                            var link = $(this).find("dt a").attr("href");

                            if (link.substr(0, 4) == "http") {
                                link = link.split("//", 2)[1];

                                if (link.substr(0, 4) == "www.")
                                    link = link.substr(4);

                                torrent["download_linkz"].push({
                                    text: link.split("/", 1).toString("utf-8"),
                                    time: ($(this).find("dd span").attr("title") ? moment($(this).find("dd span").attr("title").trim().replace(/\s+/g, " "), "ddd, DD MMM YYYY HH:mm:ss").format("X") : moment().format("X")),
                                    url: "//" + link
                                });
                            }
                        }
                    });
                }

                torrentz.push(torrent);
            }
        });

        return torrentz;
    } else return "error";
}

// Meteor.setInterval(function() {
//     new fibers(function() {
//         var inputObject = torrent_in.find({
//             status: false,
//             urlPart: {
//                 $exists: true
//             },
//             keyword: {
//                 $exists: true
//             },
//             url: {
//                 $exists: true
//             }
//         }, {
//             limit: 1,
//             sort: {
//                 time: -1
//             }
//         });

//         if (0 < inputObject.count()) {
//             inputObject.fetch().forEach(function(row) {
//                 torrent_in.update({
//                     _id: row._id
//                 }, {
//                     $set: {
//                         status: true
//                     }
//                 });

//                 torrentz_query(row.urlPart, row.keyword, row.url).forEach(function(result) {
//                     var outputObject = torrent_out.find({
//                         url: result.url
//                     });

//                     if (outputObject.count() <= 0) {
//                         result.torrent_in = [row._id];

//                         var torrent_out_id = torrent_out.insert(result);

//                         if (row.peers <= result.peers && row.seeds <= result.seeds) {
//                             row.user_id.forEach(function(userId) {
//                                 Push.send({
//                                     from: "Torrent Watch",
//                                     title: row.keyword + " updated",
//                                     text: result.title,
//                                     query: {
//                                         userId: userId
//                                     }
//                                 });

//                                 torrent_push.insert({
//                                     torrent_in: row._id,
//                                     torrent_out: torrent_out_id,
//                                     user_id: row.user_id
//                                 })
//                             });
//                         }
//                     } else {
//                         outputObject.fetch().forEach(function(item) {
//                             torrent_out.update({
//                                 url: item.url
//                             }, {
//                                 $set: {
//                                     category: result.category,
//                                     verified: result.verified,
//                                     peers: result.peers,
//                                     seeds: result.seeds
//                                 },
//                                 $addToSet: {
//                                     torrent_in: row._id
//                                 }
//                             }, {
//                                 multi: true
//                             });

//                             if (row.peers <= result.peers && row.seeds <= result.seeds && torrent_push.findOne({
//                                     torrent_in: row._id,
//                                     torrent_out: item._id,
//                                     user_id: row.user_id
//                                 })) {
//                                 row.user_id.forEach(function(userId) {
//                                     Push.send({
//                                         from: "Torrent Watch",
//                                         title: row.keyword + " updated",
//                                         text: result.title,
//                                         query: {
//                                             userId: userId
//                                         }
//                                     });

//                                     torrent_push.insert({
//                                         torrent_in: row._id,
//                                         torrent_out: item._id,
//                                         user_id: row.user_id
//                                     })
//                                 });
//                             }
//                         });
//                     }
//                 });
//             });
//         } else {
//             torrent_in.update({}, {
//                 $set: {
//                     status: false
//                 }
//             }, {
//                 multi: true
//             });
//         }
//     }).run();
// }, 1000 * 60 * 5);
