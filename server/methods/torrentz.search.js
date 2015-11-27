Meteor.methods({

    search: function(input) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(input, String);

        var response = HTTP.call("GET", "http://proxy.vcompile.com/get.php", {
            params: {
                url: "https://torrentz.eu/suggestions.php?q=" + input
            },
            timeout: 1000 * 60
        });

        if (response.statusCode === 200) {
            return _.uniq(_.flatten(JSON.parse(response.content)));
        } else {
            console.log("200", response);
        }
    }

});
