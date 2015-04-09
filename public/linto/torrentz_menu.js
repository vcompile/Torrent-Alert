Polymer("torrentz-menu", {
    inspect: null,
    list: [],

    inspectChanged: function() {
        var torrent_out_db = JSON.parse($("#torrent_out_db").val());

        if (torrent_out_db[this.inspect]) {
            var A = _.filter(torrent_out_db[this.inspect], function(item) {
                return item.deleteClass != "hidden";
            }).length;

            this.list[this.inspect].count = (0 < A) ? A : "*";
        }
    },

    listChanged: function() {
        if (this.list instanceof Array) $("#torrent_in_db").val(JSON.stringify(this.list));
        else {
            this.list = JSON.parse(this.list);
            $("#torrent_in_db").val(JSON.stringify(this.list));
        }
    },

    menuItemRelease: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    menuItemTap: function(event, detail, sender) {
        console.log($(sender).attr("tag"));
    }
});
