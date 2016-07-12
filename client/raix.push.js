Push.id();

Meteor.startup(function() {

  Push.addListener("startup", function(notification) {
    document.addEventListener("WebComponentsReady", function() {
      Meteor.call('recieved_torrent', notification.payload.torrent, function(e, r) {
        // document.querySelector("#polymer_toast").toast(e ? e.message : r);
      });

      FlowRouter.go("/torrent", {}, {
        previous: "Lw%3D%3D",
        project: notification.payload.project,
        restrict: notification.payload.torrent.join('|'),
        route: null,
      });
    });
  });

  // Push.addListener("message", function(notification) {
  //   Meteor.call('recieved_torrent', notification.payload.torrent, function(e, r) {
  //     // document.querySelector("#polymer_toast").toast(e ? e.message : r);
  //   });
  // });

});
