if (Meteor.isCordova) {
  document.addEventListener("deviceready", function() {
    document.addEventListener("backbutton", backbutton, false);
  }, false);

  function backbutton() {
    if (document.querySelector("#exit_controller")) {
      document.querySelector("#exit_controller").prompt();
    }
  }
}
