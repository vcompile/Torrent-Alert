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

    Session.set("inbox_view", JSON.parse($("#torrentz_db").val()).length ? true : false);

});
