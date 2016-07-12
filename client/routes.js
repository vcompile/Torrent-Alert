FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
    // hashbang: true,
  });
});

var main = FlowRouter.group({
  triggersEnter: [(context, redirect) => {
    if (Meteor.status().connected) {
      if (!Meteor.user()) {
        redirect("/account", {}, {
          previous: Base64.encode(ascii_array(FlowRouter.current().path ? FlowRouter.current().path : '/')),
          route: null,
        });
      }
    }
  }],
  name: 'main',
});

main.route("/", {
  action() {
    document.querySelector("#layout_main").selected = (FlowRouter.getQueryParam("route") ? FlowRouter.getQueryParam("route") : 'layout-inbox');

    Meteor.setTimeout(() => {
      document.querySelector("#layout_inbox paper-scroll-header-panel").notifyResize();
    }, 40);

    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString("#009688");
    }
  },
});

FlowRouter.route("/account", {
  action() {
    document.querySelector("#layout_account").selected = (FlowRouter.getQueryParam("route") ? FlowRouter.getQueryParam("route") : 'sign-in');
    document.querySelector("#layout_main").selected = "layout-account";

    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString("#009688");
    }
  },
});

FlowRouter.route("/filter", {
  action() {
    document.querySelector("#layout_main").selected = "project-filter";

    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString("#009688");
    }
  },
});

FlowRouter.route("/search", {
  action() {
    document.querySelector("#layout_main").selected = "layout-search";

    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString("#C0C0C0");
    }
  },
});

FlowRouter.route("/torrent", {
  action() {
    document.querySelector("#layout_torrent").selected = (FlowRouter.getQueryParam("route") ? FlowRouter.getQueryParam("route") : 'torrent-list');
    document.querySelector("#layout_main").selected = "layout-torrent";

    Meteor.setTimeout(() => {
      document.querySelector("#torrent_list paper-scroll-header-panel").notifyResize();
    }, 40);

    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString("#009688");
    }
  },
});

FlowRouter.notFound = {
  action() {
    FlowRouter.go('/', {}, {
      previous: null,
      route: null,
    });
  },
};
