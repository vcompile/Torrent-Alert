Polymer("torrentz-menu", {
    list: [],

    menuItemRelease: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    menuItemTap: function(event, detail, sender) {
        console.log($(sender).attr("tag"));
    }
});
