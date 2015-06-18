Template.layout_signIn.events({

    "click #google-plus": function(event, target) {
        if (Meteor.isCordova) {
            Meteor.cordovaSignIn({
                cordova_g_plus: true,
                profile: ["email", "email_verified", "gender", "locale", "name", "picture", "sub"]
            });
        } else {
            if (Accounts.loginServicesConfigured()) {
                Meteor.loginWithGoogle({
                    requestOfflineToken: true,
                    requestPermissions: ["email", "profile"]
                }, function(error) {
                    if (error) {
                        $("toast-handler").attr("text", Accounts.LoginCancelledError.numericError);
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    } // else location.reload();
                });
            }
        }
    }

});
