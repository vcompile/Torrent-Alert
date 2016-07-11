if (Meteor.isCordova) {
  var _exit = +moment().format('X');

  document.addEventListener("deviceready", function(e) {
    document.addEventListener("backbutton", function(e) {
      let exit = +moment().format('X');

      if (!(exit - _exit)) {
        document.querySelector("#polymer_toast").toast('Are you sure you want to exit ?', 'EXIT');
      } else {
        if (FlowRouter.getQueryParam("previous")) {
          navigator.app.backHistory();
        }
      }

      _exit = exit;
    }, false);
  }, false);

  var _LaunchScreen = LaunchScreen.hold();

  document.addEventListener("WebComponentsReady", function() {
    _LaunchScreen.release();
  });
}
