Polymer("torrentz-menu", {
    list: [],

    listChanged: function() {
        if (!(this.list instanceof Array))
            this.list = JSON.parse(this.list);
    },

    menuItemRelease: function(event, detail, sender) {
        document.querySelector("#drawer-panel").togglePanel();

        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    menuItemTap: function(event, detail, sender) {
        var index = -1;

        var item = _.find(torrentz_db, function(item) {
            index++;

            return (item["_id"] == $(sender).attr("tag"));
        });

        if (item) {
            $("torrentz-list").attr("list", JSON.stringify([item]));

            $("html /deep/ .menu-l").css("background", "#EEE");
            $(sender).css("background", "#FAFAFA");
        }
    }
});
