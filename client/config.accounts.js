_done = null;

Accounts.onEnrollmentLink(function(token, done) {
    if (Meteor.user()) {
        Meteor.logout();
    }

    FlowRouter.go("/set-password", {}, {
        "password-token": token
    });

    _done = done;
});

Accounts.onResetPasswordLink(function(token, done) {
    if (Meteor.user()) {
        Meteor.logout();
    }

    FlowRouter.go("/set-password", {}, {
        "password-token": token
    });

    _done = done;
});
