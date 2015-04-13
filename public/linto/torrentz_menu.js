Polymer("torrentz-menu", {
    list: [],

    listChanged: function() {
        if (!(this.list instanceof Array))
            this.list = JSON.parse(this.list);
    },

    menuItemRelease: function(event, detail, sender) {
        $("confirm-delete").attr("store", JSON.stringify([$(sender).attr("tag")]));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    menuItemTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        var index = -1;

        var item = _.find(torrentz_db, function(item) {
            index++;

            return (_id == item._id);
        });

        if (item) {
            $("torrentz-list").attr("list", JSON.stringify([item]));
            $("torrentz-list").attr("tag", JSON.stringify([_id]));

            $("html /deep/ .menu-l").css("background", "#EEE");
            $(sender).css("background", "#FAFAFA");
        }
    }
});
