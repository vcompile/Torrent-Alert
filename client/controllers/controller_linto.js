Template.controller_linto.helpers({
    deny: function() {
        if (Meteor.userId() == "HedCET") return true;
        else return false;
    },

    view: function() {
        if (Session.get("resetPasswordToken") && (Session.get("resetPasswordToken") != "")) return "resetPassword";
        else return Session.get("view") ? Session.get("view") : "signIn";
    }
});
