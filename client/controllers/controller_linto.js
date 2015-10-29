Template.controller_linto.helpers({

    view: function() {
        if (Session.get("password_token") && Session.get("password_token") !== "") {
            return "set_password";
        } else {
            if (Meteor.status().connected && Meteor.user()) {
                return (Session.get("route") ? Session.get("route") : "inbox");
            } else {
                return ((Session.equals("polymer-ready", 1) && document.querySelector("#torrent_db") && document.querySelector("#torrent_db").value.length) ? "inbox" : "user_check");
            }
        }
    }

});
