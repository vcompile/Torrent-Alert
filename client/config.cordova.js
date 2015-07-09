if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() { // $(document).on();

        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);

        if (navigator.connection.type == "none") {
            // $("toast-handler").attr("text", "No internet connection");
            // $("toast-handler").attr("undo_hidden_callback_opt", "");
        }

    }, false);

    function backbutton() {
        // if ($("html /deep/ #drawer-panel").width() < 768) {
        //     document.querySelector("html /deep/ #drawer-panel").closeDrawer();
        // }

        // for (var A = document.querySelectorAll("html /deep/ paper-action-dialog"), B = 0; B < A.length; B++) {
        //     A[B].close();
        // }

        // $("confirm-exit").attr("time", moment().format("x"));
    }

    function menubutton() {
        // document.querySelector("#drawer-panel").togglePanel();
    }
}
