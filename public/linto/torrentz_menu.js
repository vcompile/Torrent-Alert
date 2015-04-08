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
        if (this.list instanceof Array)
            $("#torrent_in_db").val(JSON.stringify(this.list));
    },

    menuItemRelease: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    menuItemTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        var head = JSON.parse($("#torrent_in_db").val()),
            list = JSON.parse($("#torrent_out_db").val());

        var index = -1;

        var item = _.find(head, function(item) {
            index++;

            return (item["_id"] == _id);
        });

        if (typeof(item) != "undefined" || item != null) {
            if (list[index] && list[index].length) {
                $("torrentz-list-item").attr("head", JSON.stringify([item]));
                $("torrentz-list-item").attr("list", JSON.stringify([list[index]]));

                document.querySelector("core-animated-pages").selected = 2;
            } else {
                // $("").attr("tag", _id);

                document.querySelector("core-animated-pages").selected = 3;
            }
        }
    }
});
