Template.controller_linto.helpers({

    view: function() {
        if (Session.get("password_token") && Session.get("password_token") !== "") {
            return "set_password";
        } else {
            if (Meteor.status().connected && Meteor.user()) {
                return (Session.get("route") ? Session.get("route") : "inbox");
            } else {
                return (Session.equals("torrent_db", "exists") ? "inbox" : "user_check");
            }
        }
    }

});

Template.controller_linto.rendered = function() {
    document.addEventListener("WebComponentsReady", function() {
        if (document.querySelector("#torrent_db")) {
            Session.set("torrent_db", (document.querySelector("#torrent_db").value.length ? "exists" : ""));
        }
    });
};
