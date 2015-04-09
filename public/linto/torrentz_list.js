Polymer("torrentz-list", {
    list: [],
    margin: {
        left: 8,
        right: 8
    },
    swipe: 0,
    width: 512,

    domReady: function() {
        if (512 < window.innerWidth) this.width = 512;
        else this.width = window.innerWidth - this.margin.left - this.margin.right;

        this.list = [{
            _id: "12345",
            data: [{
                _id: "123",
                category: "category",
                categoryClass: "_red",
                listClass: "item",
                peers: 100,
                seeds: 10,
                size: "100 MB",
                title: "item A"
            }, {
                _id: "123",
                category: "category",
                categoryClass: "_red",
                listClass: "hidden",
                peers: 100,
                seeds: 10,
                size: "100 MB",
                title: "item B"
            }],
            keyword: "test B hidden group"
        }, {
            _id: "12345",
            data: [{
                _id: "123",
                category: "category",
                categoryClass: "_red",
                listClass: "item",
                peers: 100,
                seeds: 10,
                size: "100 MB",
                title: "<paper-spinner active></paper-spinner>"
            }],
            keyword: "html entry test"
        }];
    },

    deleteButtonTap: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    downloadItemDown: function(event, detail, sender) {
        this.swipe = event.clientX;
    },

    downloadItemTrack: function(event, detail, sender) {
        var A = this.swipe - event.clientX;

        if (0 < A) $(sender).css("margin-left", (-A) + "px");
        else $(sender).css("margin-right", A + "px");
    },

    downloadItemUp: function(event, detail, sender) {
        this.swipe = (Math.abs(this.swipe - event.clientX) < (this.width * .5) ? 0 : 1);

        $(sender).css({
            "margin-left": 0,
            "margin-right": 0
        });
    },

    downloadItemTap: function(event, detail, sender) {
        if (this.swipe) console.log("swipe", $(sender).attr("tag"));
        else console.log("tap", $(sender).attr("tag"));

    },

    listChanged: function() {
        if (this.list instanceof Array) $("#torrent_out_db").val(JSON.stringify(this.list));
        else {
            this.list = JSON.parse(this.list);
            $("#torrent_out_db").val(JSON.stringify(this.list));
        }
    }
});
