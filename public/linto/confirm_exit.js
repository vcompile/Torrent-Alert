Polymer("confirm-exit", {
    time: null,
    time_store: moment().format("x"),

    okButtonTap: function(event, detail, sender) {
        render();

        if (Meteor.isCordova)
            navigator.app.exitApp();
    },

    timeChanged: function() {
        if ((parseInt(this.time) - parseInt(this.time_store)) < 2000) {
            document.querySelector("confirm-exit /deep/ paper-action-dialog").open();
        }

        this.time_store = moment().format("x");
    }
});
