if (Meteor.isCordova) {

    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);
    }, false);

    function backbutton() {

        if ($("html /deep/ #drawerPanel").width() <= 768) {
            document.querySelector("html /deep/ #drawerPanel").closeDrawer();
        }

        for (var A = document.querySelectorAll("html /deep/ paper-dialog"), Z = 0; Z < A.length; Z++) {
            A[Z].close();
        }

        if (document.querySelector("html /deep/ inbox-list")) {
            document.querySelector("html /deep/ inbox-list").deSelectAll();
        }

        if (document.querySelector("html /deep/ search-bar")) {
            document.querySelector("html /deep/ search-bar").enabled = false;
        }

        document.querySelector("html /deep/ confirm-exit").time = moment().format("x");

    }

    function menubutton() {
        if (document.querySelector("html /deep/ inbox-list")) {
            document.querySelector("html /deep/ inbox-list").forceNarrowTap();
        }
    }

}
