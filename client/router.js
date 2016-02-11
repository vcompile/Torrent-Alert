FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
    // hashbang: true
  });

  Meteor.setTimeout(function() {
    document.querySelector("#load_awesome").active = false;
  }, 1000 * 10);
});

FlowRouter.route("/", {
  action: function(p, q) {
    mwcLayout.render("main", {
      body: "user-check"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "sign-in":
        document.querySelector("user-check-layout").sharedElements = {
          'ripple': document.querySelector("#sign-in"),
          'reverse-ripple': document.querySelector("#sign-in")
        };

        document.querySelector("user-check").selected = 1;
        break;

      case "sign-up":
        document.querySelector("user-check-layout").sharedElements = {
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
      "search-bar": "search-bar",
      "torrent-view": "torrent-view"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "add-project":
        document.querySelector("add-project").active = true;
        break;

      case "search-bar":
        document.querySelector("search-bar").active = true;
        break;

      case "torrent-view":
        if (document.querySelector("torrent-view").torrent && _.has(document.querySelector("torrent-view").torrent, "_id")) {
          document.querySelector("torrent-view").active = true;
        } else {
          FlowRouter.setQueryParams({
            "route": null
          });
        }
        break;

      default:
        document.querySelector("add-project").active = false;
        document.querySelector("search-bar").active = false;
        document.querySelector("torrent-view").active = false;
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
