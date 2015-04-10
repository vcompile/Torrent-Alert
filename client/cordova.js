if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {

        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);

        if (navigator.connection.type == "none")
            $("body").append('<paper-toast duration="8000" opened text="No internet connection"><div style="color: #FFEB3B;" onclick="navigator.app.exitApp();">exit</div></paper-toast>');

    }, false);

    var lastBackButtonPress = moment().format("x");

    function backbutton() {
        if (moment().format("x") - lastBackButtonPress < 4000)
            $("body").append('<paper-toast duration="4000" opened text="Are you sure you want to exit ?"><div style="color: #FFEB3B;" onclick="navigator.app.exitApp();">exit</div></paper-toast>');

        lastBackButtonPress = moment().format("x");
    }

    function menubutton() {
        document.querySelector("#drawer-panel").togglePanel();
    }
}
