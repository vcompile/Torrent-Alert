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
        if ($("html /deep/ #drawer-panel").width() < 768) {
            document.querySelector("html /deep/ #drawer-panel").togglePanel();
        }

        document.querySelector("add-keyword /deep/ paper-action-dialog").close();
        document.querySelector("confirm-delete /deep/ paper-action-dialog").close();
        document.querySelector("download-linkz /deep/ paper-action-dialog").close();

        $("confirm-exit").attr("time", moment().format("x"));
    }

    function menubutton() {
        document.querySelector("#drawer-panel").togglePanel();
    }
}
