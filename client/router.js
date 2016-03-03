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
      if (!(document.querySelector("#torrent_db").value || []).length) { // localstorage
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
        document.querySelector("#old_layout").selected = "add-project";
        break;

      case "favorite":
        document.querySelector("#old_layout").selected = "favorite-view";
        break;

      case "project-view":
        if (FlowRouter.getQueryParam("project")) {
          document.querySelector("#old_layout").selected = "project-view";
        }
        break;

      case "search-view":
        document.querySelector("#old_layout").selected = "search-view";
        break;

      case "torrent-view":
        if (FlowRouter.getQueryParam("torrent")) {
          document.querySelector("#old_layout").selected = "torrent-view";
        }
        break;

      default:
        document.querySelector("#old_layout").selected = "trending-view";
        break;
    }
  },
  name: "main-layout"
});

main.route("/sign-out", {
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
          'ripple': document.querySelector("#sign-in"),
          'reverse-ripple': document.querySelector("#sign-in")
        };

        document.querySelector("user-check").selected = "sign-in";
        break;

      case "sign-up":
        document.querySelector("user-check-layout").sharedElements = {
          'ripple': document.querySelector("#sign-up"),
          'reverse-ripple': document.querySelector("#sign-up")
        };

        document.querySelector("user-check").selected = "sign-up";
        break;
    }
  },
  name: "user-check"
});
