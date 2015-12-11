if (Meteor.isCordova) {
    document.addEventListener("deviceready", function() {
        document.addEventListener("backbutton", backbutton, false);
        document.addEventListener("pause", pause, false);
    }, false);

    function backbutton() {
        if (document.querySelector("#exit_controller")) {
            document.querySelector("#exit_controller").time(moment().format("x"));
        }

        FlowRouter.setQueryParams({
            "route": null
        });
    }

    function pause() {
        project_save();
    }
} else {
    $(window).on("beforeunload", function() {
        project_save();
    });
}
