Template.controller_linto.helpers({

    view: function() {
        if (Session.get("password_token") && Session.get("password_token") !== "") {
            return "set_password";
        } else {
            if (Meteor.status().connected && Meteor.user()) {
                return (Session.get("route") ? Session.get("route") : "inbox");
            } else {
                return ((1 < Session.get("polymer-ready") && document.querySelector("#torrent_db") && document.querySelector("#torrent_db").value.length) ? "inbox" : "user_check");
            }
        }
    }

});
