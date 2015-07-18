$(document).on("polymer-ready", function() {

    // session var view

    Meteor.autorun(function() {
        Session.set("view", (Meteor.user() || JSON.parse($("#torrentz_db").val()).length) ? "inbox" : "signIn");
    });

    // subscription

    Meteor.subscribe("torrent_in");

    Meteor.subscribe("torrent_out", {
        torrent_in: _.map(JSON.parse($("#torrentz_db").val()), function(item) {
            return item._id
        })
    });

    Meteor.subscribe("torrent_worker");

    // loading

    Session.set("polymer-ready", true);

});
