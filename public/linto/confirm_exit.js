Polymer("confirm-exit", {
    time: null,
    time_store: moment().format("x"),

    okButtonTap: function(event, detail, sender) {
        render();

        if (Meteor.isCordova)
            navigator.app.exitApp();
    },

    timeChanged: function() {
        if (this.time - this.time_store < 4000)
            document.querySelector("confirm-exit /deep/ paper-action-dialog").open();

        this.time_store = moment().format("x");
    }
});
