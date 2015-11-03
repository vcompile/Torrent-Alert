if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("menubutton", menubutton, false);
        document.addEventListener("pause", pause, false);
    }, false);

    function backbutton() {
        if (document.querySelector("#exit_controller")) {
            document.querySelector("#exit_controller").time(moment().format("x"));
        }

        if (document.querySelector("modal-wrapper")) {
            document.querySelector("modal-wrapper").active = true;
        }

        if (document.querySelector("#drawer")) {
            document.querySelector("#drawer").closeDrawer();
        }

        if (document.querySelector("#add_project")) {
            document.querySelector("#add_project").active = false;
        }

        if (document.querySelector("#search_bar")) {
            document.querySelector("#search_bar").active = false;
        }

        for (var A = document.querySelectorAll("paper-dialog"), Z = 0; Z < A.length; Z++) {
            A[Z].close();
        }
    }

    function menubutton() {
        if (document.querySelector("#layout_inbox")) {
            document.querySelector("#layout_inbox").menuToggle();
        }
    }

    function pause() {
        project_save();
    }
}
