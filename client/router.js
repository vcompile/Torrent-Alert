FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
    FlowRouter.initialize({
        // hashbang: true
    });

    Tracker.autorun(function() {
        if (Meteor.status().connected) {
            if (Meteor.user() && (!FlowRouter.current().route.group || FlowRouter.current().route.group.name != "inbox")) {
                FlowRouter.go("/inbox");
            }
        } else {
            if ((document.querySelector("#torrent_db").value || []).length) {
                FlowRouter.go("/inbox");
            }
        }
    });
});

FlowRouter.route("/", {
    action: function(p, q) {
        mwcLayout.render("main", {
            body: "user-check"
        });

        switch (FlowRouter.getQueryParam("route")) {
            case "sign-in":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("#sign-in"),
                    'reverse-ripple': document.querySelector("#sign-in")
                };

                document.querySelector("user-check").selected = 1;
                break;

            case "sign-up":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("#sign-up"),
                    'reverse-ripple': document.querySelector("#sign-up")
                };

                document.querySelector("user-check").selected = 2;
                break;
        }
    },
    name: "user-check"
});

FlowRouter.route("/set-password", {
    action: function(p, q) {
        mwcLayout.render("set-password", {
            opt: "set-password"
        });
    },
    name: "set-password"
});

var inbox = FlowRouter.group({
    name: "inbox",
    prefix: "/inbox",
    triggersEnter: [function(context, redirect) {
        if (Meteor.status().connected) {
            if (!Meteor.user()) {
                FlowRouter.go("/");
            }
        } else {
            if (!(document.querySelector("#torrent_db").value || []).length) {
                FlowRouter.go("/");
            }
        }
    }]
});

inbox.route("/", {
    action: function(p, q) {
        mwcLayout.render("inbox", {
            "add-project": "add-project",
            "layout-inbox": "layout-inbox",
            "search-bar": "search-bar"
        });

        switch (FlowRouter.getQueryParam("route")) {
            case "add-project":
                document.querySelector("add-project").active = true;
                break;

            case "remove-prompt":
                if (document.querySelector("#remove_prompt").dataset.id) {
                    document.querySelector("#remove_prompt").open();
                } else {
                    FlowRouter.setQueryParams({
                        "route": null
                    });
                }
                break;

            case "schedule-prompt":
                if (document.querySelector("#schedule_prompt").dataset.id) {
                    document.querySelector("#schedule_prompt").open();
                } else {
                    FlowRouter.setQueryParams({
                        "route": null
                    });
                }
                break;

            case "search-bar":
                document.querySelector("search-bar").active = true;

                Meteor.setTimeout(function() {
                    document.querySelector("search-bar #input").focus();
                }, 400);
                break;

            case "torrent-prompt":
                if (_.has(document.querySelector("layout-inbox").torrent_prompt, "_id")) {
                    document.querySelector("#torrent_prompt").active = true;
                } else {
                    FlowRouter.setQueryParams({
                        "route": null
                    });
                }
                break;

            case "user-prompt":
                if (Meteor.user()) {
                    document.querySelector("#user_prompt").open();
                } else {
                    FlowRouter.setQueryParams({
                        "route": null
                    });
                }
                break;

            default:
                document.querySelector("add-project").active = false;
                document.querySelector("search-bar").active = false;
                document.querySelector("#torrent_prompt").active = false;

                document.querySelector("#remove_prompt").close();
                document.querySelector("#schedule_prompt").close();
                document.querySelector("#user_prompt").close();
                break;
        }
    },
    name: "layout-inbox"
});

inbox.route("/sign-out", {
    action: function(p, q) {
        if (Meteor.status().connected) {
            document.querySelector("#torrent_db").value = [];

            Meteor.logout(function(error) {
                if (error) {
                    console.log(error);
                }
            });

            FlowRouter.go("/");
        } else {
            document.querySelector("#polymer_toast").toast("server connection required");
        }
    },
    name: "sign-out"
});
