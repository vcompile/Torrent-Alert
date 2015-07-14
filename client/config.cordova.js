if (Meteor.isCordova) {

    document.addEventListener("deviceready", function() {

        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);

        if (navigator.connection.type == "none") {
            window.setTimeout(function() {
                if (document.querySelector("html /deep/ user-auth")) {
                    document.querySelector("html /deep/ user-auth").toastText = "No internet connection";
                    document.querySelector("html /deep/ user-auth").toastOpened = true;
                }
            }, 4000);
        }

    }, false);

    function backbutton() {

        if ($("html /deep/ #drawerPanel").width() <= 768) {
            document.querySelector("html /deep/ #drawerPanel").closeDrawer();
        }

        for (var A = document.querySelectorAll("html /deep/ paper-dialog"), Z = 0; Z < A.length; Z++) {
            A[Z].close();
        }

        $("html /deep/ confirm-exit").attr("time", moment().format("x"));

    }

    function menubutton() {
        if (document.querySelector("html /deep/ inbox-list")) {
            document.querySelector("html /deep/ inbox-list").forceNarrowTap();
        }
    }

}
