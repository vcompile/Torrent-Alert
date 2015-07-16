$(document).on("polymer-ready", function() {

    // subscription

    Meteor.subscribe("torrent_in");

    Meteor.subscribe("torrent_out", {
        torrent_in: _.map(JSON.parse($("#torrentz_db").val()), function(item) {
            return item._id
        })
    });

    Meteor.subscribe("torrent_worker");

    // session var inbox_view
    Meteor.autorun(function() {
        Session.set("inbox_view", (Meteor.user() || JSON.parse($("#torrentz_db").val()).length) ? true : false);
    });

    // user-auth loading

    if (document.querySelector("html /deep/ user-auth")) {
        document.querySelector("html /deep/ user-auth").loading = false;
    }

});
