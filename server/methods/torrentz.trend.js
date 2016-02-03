Meteor.methods({

  trend: function() {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    var response = HTTP.call("GET", "http://do.vcompile.com/proxy/get.php", {
        params: {
          url: "https://torrentz-proxy.com"
        },
        timeout: 1000 * 60
      }),
      trend = [];

    if (response.statusCode === 200) {
      if (80 < response.content.length) {
        $ = Meteor.npmRequire("cheerio").load(response.content);

        $(".cloud a").each(function() {
          var A = $(this).text().replace(/\s+/g, " ").trim();

          if (A.length) {
            trend.push(A);
          }
        });
      } else {
        console.log("80", response);
      }
    } else {
      console.log("200", response);
    }

    return trend;
  }

});
