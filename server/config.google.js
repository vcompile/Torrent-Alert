Meteor.startup(function() {
    Accounts.loginServiceConfiguration.remove({
        service: "google"
    });

    Accounts.loginServiceConfiguration.insert({
        service: "google",
        clientId: "",
        secret: ""
    });
});

Accounts.onCreateUser(function(opts, user) {
    if (user.services.google) {
        var res = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "User-Agent": "Meteor/1.0"
            },

            params: {
                access_token: user.services.google.accessToken
            }
        });

        if (res.error) {
            throw res.error;
        } else {
            user.profile = _.extend(_.pick(res.data, "email", "email_verified", "gender", "locale", "name", "picture", "sub"), {
                time: moment().format()
            });
        }
    }

    return user;
});
