Template.controller_linto.helpers({
    inbox_view: function() {
        return (Session.get("inbox_view") || Meteor.loggingIn() || Meteor.user()) ? true : false;
    },

    resetPasswordToken: function() {
        return (Session.get("resetPasswordToken") && (Session.get("resetPasswordToken") != "_")) ? true : false;
    }
});
