Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: 0,
    sendVerificationEmail: true
});

Meteor.methods({

    sendEnrollmentEmail: function(email) {
        // this.unblock();

        check(email, String);

        var valid_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!valid_email.test(email)) {
            throw new Meteor.Error(422, "invalid email");
        }

        var row = Meteor.users.findOne({
            "profile.email": email
        });

        if (row) {
            Accounts.sendEnrollmentEmail(row._id, email);

            return "enrollAccount url sent @ email";
        } else throw new Meteor.Error(422, "userNotFound");
    },

    signUp: function(email) {
        this.unblock();

        check(email, String);

        var valid_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!valid_email.test(email)) {
            throw new Meteor.Error(422, "invalid email");
        }

        var _id = Accounts.createUser({
            email: email
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
                        email: email,
                        name: "user",
                        picture: "/img/user.png"
                    }
                }
            });
        }

        Accounts.sendEnrollmentEmail(_id);

        return "enrollAccount url sent @ email";
    }

});
