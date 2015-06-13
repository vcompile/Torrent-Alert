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
    // sendVerificationEmail: true
});

Accounts.onCreateUser(function(opts, user) {
    var res = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            "User-Agent": "Meteor/1.0"
        },

        params: {
            access_token: user.services.google.accessToken
        }
    });

    if (res.error)
        throw res.error;

    user.profile = _.extend(_.pick(res.data, "email", "email_verified", "gender", "locale", "name", "picture", "sub"), {
        time: moment().format()
    });

    return user;
});

Accounts.registerLoginHandler(function(req) {
    if (!req.cordova_g_plus)
        return undefined;

    var user = Meteor.users.findOne({
            "services.google.email": req.email,
            "services.google.id": req.id
        }),
        userId = null;

    if (!user) {
        var res = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "User-Agent": "Meteor/1.0"
            },

            params: {
                access_token: req.oAuthToken
            }
        });

        if (res.error) throw res.error;
        else {
            if (req.email == res.data.email && req.id == res.data.sub) {
                var googleResponse = _.pick(res.data, "email", "email_verified", "gender", "locale", "name", "picture", "sub");

                googleResponse.id = googleResponse.sub;
                delete googleResponse.sub;

                userId = Meteor.users.insert({
                    createdAt: moment().format(),
                    profile: googleResponse,
                    services: {
                        google: _.extend(googleResponse, {
                            accessToken: req.oauthToken
                        })
                    }
                });
            } else throw new Meteor.Error(422, "AccessToken MISMATCH");
        }
    } else userId = user._id;

    var stampedToken = Accounts._generateStampedLoginToken();
    var stampedTokenHash = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update({
        _id: userId
    }, {
        $push: {
            "services.resume.loginTokens": stampedTokenHash
        }
    });

    return {
        token: stampedToken.token,
        userId: userId
    };
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
