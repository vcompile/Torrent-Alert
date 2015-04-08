$(document).on("polymer-ready", function() {

    Meteor.subscribe("torrent_in");

    Meteor.subscribe("torrent_out", {
        torrent_in: _.map(JSON.parse($("#torrent_in_db").val()), function(item) {
            return item._id
        })
    });

});
