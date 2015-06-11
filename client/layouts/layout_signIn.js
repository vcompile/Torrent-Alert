Template.layout_signIn.events({

    "click #google-plus": function(event, target) {
        if (Meteor.isCordova) {
            Meteor.cordovaSignIn({
                cordova_g_plus: true
            });
        } else {
            if (Accounts.loginServicesConfigured()) {
                Meteor.loginWithGoogle({
                    requestOfflineToken: true,
                    requestPermissions: ["email", "profile"]
                }, function(error) {
                    if (error) toast(Accounts.LoginCancelledError.numericError);
                    else location.reload();
                });
            }
        }
    }

});
