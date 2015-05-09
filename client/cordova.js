if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {

        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);

        if (navigator.connection.type == "none") {
            $("toast-handler").attr("text", "No internet connection");
            $("toast-handler").attr("undo_hidden_callback_opt", "");
        }

    }, false);

    function backbutton() {
        $("confirm-exit").attr("time", moment().format("x"));
    }

    function menubutton() {
        document.querySelector("#drawer-panel").togglePanel();
    }
}
