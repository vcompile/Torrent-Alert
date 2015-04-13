Polymer("torrentz-list", {
    list: [],
    margin: {
        left: 8,
        right: 8
    },
    swipe: 0,
    width: 512,

    deleteButtonTap: function(event, detail, sender) {
        $("confirm-delete").attr("store", JSON.stringify([$(sender).attr("tag")]));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    domReady: function() {
        if (512 < window.innerWidth) this.width = 512;
        else this.width = window.innerWidth - this.margin.left - this.margin.right;
    },

    downloadItemTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        $("download-linkz").attr("body", "<div center-justified horizontal layout><paper-spinner active></paper-spinner></div>");
        $("download-linkz").attr("header", $(sender).html());

        document.querySelector("download-linkz /deep/ paper-action-dialog").toggle();

        Meteor.call("downloadLinkz", _id, function(error, linkz) {
            if (error) toast(error.reason);
            else {
                var body = "";

                linkz.forEach(function(item) {
                    body += '<div class="download-link menu-l" horizontal layout onclick="window.open(\'' + item.url + '\', \'_system\');"><div self-center><div class="' + polymer_color(item.text) + ' menu-l-icon-text">' + (isNaN(item.text.charAt(0)) ? item.text.charAt(0).toUpperCase() : "#") + '</div></div><div class="menu-l-description" flex layout self-center vertical><div auto-vertical horizontal layout>' + item.text + '</div><div auto-vertical class="menu-l-description-small">' + item.fromNow + '</div></div></div>';
                });

                $("download-linkz").attr("body", body);
            }
        });
    },

    downloadItemTrack: function(event, detail, sender) {
        var A = this.swipe - event.clientX;

        if (0 < A) $(sender).css("margin-left", (-A) + "px");
        else $(sender).css("margin-right", A + "px");
    },

    downloadItemTrackend: function(event, detail, sender) {
        $(sender).css("margin", 0);

        if ((this.width * .25) < this.swipe - event.clientX) {
            $(sender).addClass("hidden");

            var _id = $(sender).attr("tag");

            for (var A = 0; A < torrentz_db.length; A++) {
                var index = -1;

                var item = _.find(torrentz_db[A].torrent_out, function(item) {
                    index++;

                    return (_id == item._id);
                });

                if (item) {
                    torrentz_db[A].torrent_out[index].listClass = "hidden";

                    var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                        return item.listClass == "item";
                    }).length;

                    torrentz_db[A].count = (0 < count) ? count : "*";

                    toast("1 item removed", 2000, '<div onclick="undo_hidden_callback([\'' + _id + '\'])" style="color: #FFEB3B;">undo</div>');

                    break;
                }
            }
        }
    },

    downloadItemTrackstart: function(event, detail, sender) {
        this.swipe = event.clientX;
    },

    listChanged: function() {
        if (!(this.list instanceof Array))
            this.list = JSON.parse(this.list);
    }
});
