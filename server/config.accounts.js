Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: 0,
    sendVerificationEmail: true
});

Meteor.methods({

    signUp: function(req) {
        this.unblock();

        var req = _.pick(req, "email", "username");

        check(req, {
            email: String,
            username: String
        });

        var valid_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!valid_email.test(req.email)) {
            throw new Meteor.Error(422, "invalid email");
        }

        var valid_username = /^[0-9a-z]+$/i;

        if (!valid_username.test(req.username)) {
            throw new Meteor.Error(422, "alpha-numeric username required");
        }

        if (req.username.length < 4) {
            throw new Meteor.Error(422, "min username length is 4");
        }

        var _id = Accounts.createUser({
            email: req.email,
            username: req.username
        })

        var row = Meteor.users.findOne({
            _id: _id
        });

        if (row && !row.profile) {
            Meteor.users.update({
                _id: _id
            }, {
                $set: {
                    profile: {
                        email: req.email,
                        name: req.username
                    }
                }
            });
        }

        Accounts.sendEnrollmentEmail(_id);

        return "enrollAccount URL sent @ email";
    }

});
