Polymer("torrentz-menu", {
    list: [],

    menuItemRelease: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    listChanged: function() {
        if (!(this.list instanceof Array))
            this.list = JSON.parse(this.list);
    },

    menuItemTap: function(event, detail, sender) {
        var index = -1;

        var item = _.find(torrentz_db, function(item) {
            index++;

            return (item["_id"] == $(sender).attr("tag"));
        });

        if (typeof(item) != "undefined" || item != null)
            $("torrentz-list").attr("list", JSON.stringify([item]));
    }
});
