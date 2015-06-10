Meteor.cordova_g_plus = function(request, callback) {
    window.plugins.googleplus.login({},
        function(response) {
            request.email = response.email;
            request.id = response.userId;
            request.oAuthToken = response.oauthToken;

            Accounts.callLoginMethod({
                methodArguments: [request],
                userCallback: callback
            });
        },
        function(error) {
            $("toast-handler").attr("text", error);
            $("toast-handler").attr("undo_hidden_callback_opt", "");
        }
    );
};
