if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, true);

        if (navigator.connection.type == "none")
            $("body").append('<paper-toast duration="4000" opened text="internet notFound"><div style="color: #FFEB3B;" onclick="navigator.app.exitApp();">exit</div></paper-toast>');
    }, false);

    var lastBackButtonPress = moment().format("YYYY-MM-DD HH:mm:ss");

    function backbutton() {
        if (moment().diff(moment(lastBackButtonPress, "YYYY-MM-DD HH:mm:ss"), "seconds") < 2)
            $("body").append('<paper-toast duration="4000" opened text="Do you really want to exit ?"><div style="color: #FFEB3B;" onclick="navigator.app.exitApp();">exit</div></paper-toast>');

        lastBackButtonPress = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    function menubutton() {
        document.querySelector("#drawer-panel").togglePanel();
    }
}
