FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
    // hashbang: true
  });

  Meteor.setTimeout(function() {
    document.querySelector("#load_awesome").active = false;
  }, 1000 * 4);
});

var main = FlowRouter.group({
  name: "main",
  prefix: "/main",
  triggersEnter: [function(context, redirect) {
    if (Meteor.status().connected) {
      if (!Meteor.user()) {
        FlowRouter.go("/");
      }
    } else { // offline
      if (!(localStorage.favorite || []).length) { // localstorage
        FlowRouter.go("/");
      }
    }
  }]
});

main.route("/", {
  action: function(p, q) {
    mwcLayout.render("main-layout", {
      "body": "main-layout"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "add-project":
      case "favorite-list":
      case "search-list":
      case "torrent-list":
        document.querySelector("#old_layout").selected = FlowRouter.getQueryParam("route");
        break;

      case "project-list":
        if (FlowRouter.getQueryParam("project")) {
          document.querySelector("#old_layout").selected = "project-list";
        }
        break;

      default:
        document.querySelector("#old_layout").selected = "trending-list";
        break;
    }
  },
  name: "main-layout"
});

main.route("/sign-out", {
  action: function(p, q) {
    if (Meteor.status().connected) {
      localStorage.clear();

      if (Meteor.isCordova) {
        window.plugins.googleplus.disconnect(
          function(response) {
            console.log(response);
          }
        );
      }

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

FlowRouter.route("/set-password", {
  action: function(p, q) {
    mwcLayout.render("set-password", {
      body: "set-password"
    });
  },
  name: "set-password"
});

FlowRouter.route("/", {
  action: function(p, q) {
    mwcLayout.render("user-check", {
      body: "user-check"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "sign-in":
        document.querySelector("user-check-layout").sharedElements = {
          "reverse-ripple": document.querySelector("#sign-in"),
          ripple: document.querySelector("#sign-in")
        };

        document.querySelector("user-check").selected = "sign-in";
        break;

      case "sign-up":
        document.querySelector("user-check-layout").sharedElements = {
          "reverse-ripple": document.querySelector("#sign-up"),
          ripple: document.querySelector("#sign-up")
        };

        document.querySelector("user-check").selected = "sign-up";
        break;
    }
  },
  name: "user-check"
});
