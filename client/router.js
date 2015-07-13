Meteor.startup(function() {
    Session.set("polymer-ready", false);

    $(window).on("polymer-ready", function() {
        Session.set("polymer-ready", true);
    });

    Tracker.autorun(function() {
        if (Session.get("polymer-ready")) {
            Router.insert({
                el: "body"
            }).start();
        }
    });
});

Router.configure({

    autoRender: false,
    autoStart: false,

    layoutTemplate: "layoutTemplate",
    loadingTemplate: "loadingTemplate",
    notFoundTemplate: "notFoundTemplate",

    progressSpinner: false

});

Router.map(function() {

    this.route("inbox", {
        onBeforeAction: function() {
            if (Session.get("resetPasswordToken")) {
                Router.go("/resetPassword");
            } else {
                if (!Meteor.user()) {
                    if (!Meteor.loggingIn()) {
                        Router.go("/signIn");
                    }
                }
            }

            this.next();
        },
        path: "/",
        template: "inbox"
    });

    this.route("resetPassword", {
        onBeforeAction: function() {
            if (Session.get("resetPasswordToken")) {
                if (Meteor.user()) {
                    Meteor.logout();
                }
            } else {
                Router.go("/");
            }

            this.next();
        }
    });

    this.route("signIn", {
        onBeforeAction: function() {
            if (Meteor.user()) {
                Router.go("/");
            }

            this.next();
        }
    });

});
