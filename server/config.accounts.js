Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: 0,
    sendVerificationEmail: true
});

Meteor.methods({

    signUp: function(req) {
        this.unblock();

        check(req, {
            email: String
        });

        var valid_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!valid_email.test(req.email)) {
            throw new Meteor.Error(422, "invalid email");
        }

        var _id = Accounts.createUser({
            email: req.email
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
                        name: "user"
                    }
                }
            });
        }

        Accounts.sendEnrollmentEmail(_id);

        return "enrollAccount URL sent @ email";
    }

});
