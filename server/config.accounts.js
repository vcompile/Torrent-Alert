var google = {
    clientId: "1035713157090-frci49e652m1ep8n9qerin4r8u9vpb9f.apps.googleusercontent.com",
    clientSecret: "9IZvL7GcscaLyOGpzvUz7uA4"
};

Meteor.startup(function() {

    Accounts.loginServiceConfiguration.remove({
        service: "google"
    });

    Accounts.loginServiceConfiguration.insert({
        service: "google",
        clientId: google.clientId,
        secret: google.clientSecret
    });

});

Accounts.config({
    // forbidClientAccountCreation: true,
    loginExpirationInDays: 0,
    // restrictCreationByEmailDomain: function(emailId) {
    //     var domainAllowed = ["tinymail.in"];
    //     var domain = emailId.slice(emailId.lastIndexOf("@") + 1);
    //     return _.contains(domainAllowed, domain);
    // },
    sendVerificationEmail: true
});

// Accounts.validateNewUser(function(user) {
//     var regex = /^[a-zA-Z0-9]+$/;
//     if (regex.test(user.username) && (user.username).length >= 6) return true;
//     else throw new Meteor.Error(422, "validateNewUser username");
// });

// Accounts.validateNewUser(function(user) {
//     var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     user.emails.forEach(function(email) {
//         if (!regex.test(email.address)) throw new Meteor.Error(422, "validateNewUser email");
//     });
//     return true;
// });

Accounts.onCreateUser(function(opts, user) {
    var result = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            "User-Agent": "Meteor/1.0"
        },

        params: {
            access_token: user.services.google.accessToken
        }
    });

    if (result.error)
        throw result.error;

    user.profile = _.extend(_.pick(result.data, "email", "email_verified", "locale", "name", "picture"), {
        time: moment().format("X")
    });

    return user;
});

Accounts.emailTemplates.siteName = "vcompile";
Accounts.emailTemplates.from = "Linto Cheeran <linto@vcompile.com>";

Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "hi (" + user.username + "), reset password @ vcompile";
};

Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return "to reset password, open the link below in browser\n" + url.replace("#/reset-password", "r");
};

Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "hi (" + user.username + "), verify eMail @ vcompile";
};

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return "to verify eMail, open the link below in browser\n" + url.replace("#/verify-email", "v");
};
