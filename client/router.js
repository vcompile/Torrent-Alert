FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
    FlowRouter.initialize();
});

FlowRouter.route("/", {
    action: function(p, q) {
        mwcLayout.render("main", {
            body: "user-check"
        });

        switch (FlowRouter.getQueryParam("route")) {
            case "sign-in":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("user-check"),
                    'reverse-ripple': document.querySelector("user-check")
                };

                document.querySelector("user-check").selected = 1;
                break;

            case "reset-password":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("user-check"),
                    'reverse-ripple': document.querySelector("user-check")
                };

                document.querySelector("user-check").selected = 2;
                break;

            case "sign-up":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("user-check"),
                    'reverse-ripple': document.querySelector("user-check")
                };

                document.querySelector("user-check").selected = 3;
                break;

            case "resend-enrollment-email":
                document.querySelector("#router").sharedElements = {
                    'ripple': document.querySelector("user-check"),
                    'reverse-ripple': document.querySelector("user-check")
                };

                document.querySelector("user-check").selected = 4;
                break;
        }
    },
    name: "user-check"
});

FlowRouter.route("/set-password", {
    action: function(p, q) {
        mwcLayout.render("main", {
            body: "set-password"
        });
    },
    name: "set-password"
});

FlowRouter.route("/inbox", {
    action: function(p, q) {
        mwcLayout.render("main", {
            body: "layout-inbox"
        });
    },
    name: "inbox"
});
