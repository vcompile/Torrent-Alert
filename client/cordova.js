if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {

        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);

        if (navigator.connection.type == "none")
            $("body").append('<paper-toast duration="8000" opened text="No internet connection"><div style="color: #FFEB3B;" onclick="navigator.app.exitApp();">exit</div></paper-toast>');

    }, false);

    function backbutton() {
        $("confirm-exit").attr("time", moment().format("x"));
    }

    function menubutton() {
        document.querySelector("#drawer-panel").togglePanel();
    }
}
