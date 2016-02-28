Meteor.methods({

  count: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    var response = HTTP.call("GET", "http://do.vcompile.com/proxy/get.php", {
      params: {
        url: "https://torrentz-proxy.com/search?q=" + input
      },
      timeout: 1000 * 60
    });

    if (response.statusCode === 200) {
      if (80 < response.content.length) {
        $ = Meteor.npmRequire("cheerio").load(response.content);

        var result = $("h2").text().match(/[0-9,]+/);

        return (result ? result.join().replace(/[^0-9]/, "") : null);
      } else {
        console.log("80", response);
      }
    } else {
      console.log("200", response);
    }
  }

});
