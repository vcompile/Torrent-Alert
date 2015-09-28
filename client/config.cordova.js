if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);
        document.addEventListener("pause", pause, false);
    }, false);

    function backbutton() {
        document.querySelector("html /deep/ exit-popup").time = moment().format("x");

        if (document.querySelector("html /deep/ #drawerPanel")) {
            document.querySelector("html /deep/ #drawerPanel").closeDrawer();
        }

        if (document.querySelector("html /deep/ search-bar")) {
            document.querySelector("html /deep/ search-bar").enabled = false;
        }

        for (var A = document.querySelectorAll("html /deep/ paper-action-dialog"), Z = 0; Z < A.length; Z++) {
            A[Z].close();
        }

        for (var A = document.querySelectorAll("html /deep/ paper-dialog"), Z = 0; Z < A.length; Z++) {
            A[Z].close();
        }
    }

    function menubutton() {
        if (document.querySelector("html /deep/ layout-inbox")) {
            document.querySelector("html /deep/ layout-inbox").menuToggle();
        }
    }

    function pause() {
        save();
    }
}
