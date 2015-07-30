$(document).on("polymer-ready", function() {

    // session var view

    Meteor.autorun(function() {
        Session.set("view", (Meteor.user() || JSON.parse($("#torrentz_db").val()).length) ? "inbox" : "signIn");
    });

    // polymer color local db

    polymer_color_db = JSON.parse($("#polymer_color_db").val());

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
