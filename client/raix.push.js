Push.id();

Meteor.startup(function() {
  Push.addListener("startup", function(notification) {
    document.addEventListener("WebComponentsReady", function() {
      FlowRouter.go("/torrent", {}, {
        previous: "Lw%3D%3D",
        project: notification.payload.project,
        restrict: notification.payload.torrent.join('|'),
        route: null,
      });
    });
  });
});
