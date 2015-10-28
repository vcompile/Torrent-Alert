if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);
    }, false);

    function backbutton() {

    }

    function menubutton() {

    }
}
