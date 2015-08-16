Template.controller_linto.helpers({
    view: function() {
        // if (Session.get("resetPasswordToken") && (Session.get("resetPasswordToken") != "")) return "resetPassword";
        // else return Session.get("view") ? Session.get("view") : "signIn";

        return "inbox";
    }
});
