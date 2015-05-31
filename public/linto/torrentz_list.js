Polymer("torrentz-list", {
    list: [],
    margin: {
        left: 8,
        right: 8
    },
    selected: {},
    // swipe: 0,
    width: 512,
    year: moment().format("YYYY"),

    deleteButtonTap: function(event, detail, sender) {
        $("confirm-delete").attr("store", JSON.stringify([$(sender).attr("tag")]));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").open();
    },

    domReady: function() {
        if (512 < window.innerWidth) this.width = 512;
        else this.width = window.innerWidth - this.margin.left - this.margin.right;
    },

    downloadItemHold: function(event, detail, sender) {
        this.selected[$(sender).attr("tag")] = 0;
    },

    downloadItemHoldPulse: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        if (++this.selected[_id] == 1) {
            if ($(sender).hasClass("selected")) {
                this.selected[_id] = -10;

                window.setTimeout(function() {
                    $(sender).removeClass("selected");
                }, 400);
            } else $(sender).addClass("selected");
        }
    },

    downloadItemTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag"),
            delete_opt = [];

        if ($(sender).hasClass("selected")) {
            _.each(this.selected, function(value, key) {
                if (0 < value) delete_opt.push(key);
            });
        } else {
            this.selected = {};

            $("torrentz-list /deep/ .li.item").removeClass("selected");

            $("download-linkz").attr("body", "<div center-justified horizontal layout><paper-spinner active></paper-spinner></div>");
            $("download-linkz").attr("header", $(sender).html());

            document.querySelector("download-linkz /deep/ paper-action-dialog").open();

            var body = "";

            torrentz_db.forEach(function(A) {
                A.torrent_out.forEach(function(B) {
                    if (_id == B._id && B.linkz.length) {
                        B.linkz.forEach(function(C) {
                            body += '<div class="download-link menu-l" horizontal layout onclick="window.open(\'' + C.url + '\', \'_system\');"><div self-center><div class="' + polymer_color(C.text) + ' menu-l-icon-text">' + (isNaN(C.text.charAt(0)) ? C.text.charAt(0).toUpperCase() : "#") + '</div></div><div class="menu-l-description" flex layout self-center vertical><div auto-vertical horizontal layout>' + C.text + '</div><div auto-vertical class="menu-l-description-small">' + moment(C.time, "X").fromNow() + '</div></div></div>';
                        });
                    }
                });
            });

            if (body != "")
                $("download-linkz").attr("body", body);
        }

        $("more-dropdown").attr("store", delete_opt.length ? JSON.stringify({
            delete: delete_opt
        }) : "{}");
    },

    listChanged: function() {
        if (!(this.list instanceof Array))
            this.list = JSON.parse(this.list);

        $("more-dropdown").attr("store", "{}");
    }
});
