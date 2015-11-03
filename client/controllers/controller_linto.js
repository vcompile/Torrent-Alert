Template.controller_linto.helpers({
    view: function() {
        if (Session.get("password_token") && Session.get("password_token") !== "") {
            return "set_password";
        } else {
            if (Meteor.status().connected && Meteor.user()) {
                return (Session.get("route") ? Session.get("route") : "inbox");
            } else {
                return (0 < Session.get("project_count_local") ? "inbox" : "user_check");
            }
        }
    }
});

Template.controller_linto.rendered = function() {
    document.addEventListener("WebComponentsReady", function() {
        Session.set("project_count_local", (document.querySelector("#torrent_db").value ? document.querySelector("#torrent_db").value.length : 0));
    });
};
