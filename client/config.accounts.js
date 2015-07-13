callback_done = null;

Accounts.onEnrollmentLink(function(token, done) {
    if (Meteor.user()) {
        Meteor.logout();
    }

    Session.set("resetPasswordToken", token);
    callback_done = done;
});

Accounts.onResetPasswordLink(function(token, done) {
    if (Meteor.user()) {
        Meteor.logout();
    }

    Session.set("resetPasswordToken", token);
    callback_done = done;
});
