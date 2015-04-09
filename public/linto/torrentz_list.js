Polymer("torrentz-list", {
    list: [],
    margin: {
        left: 8,
        right: 8
    },
    swipe: 0,
    width: 512,

    deleteButtonTap: function(event, detail, sender) {
        $("confirm-delete /deep/ #ok").attr("tag", $(sender).attr("tag"));
        document.querySelector("confirm-delete /deep/ paper-action-dialog").toggle();
    },

    domReady: function() {
        if (512 < window.innerWidth) this.width = 512;
        else this.width = window.innerWidth - this.margin.left - this.margin.right;
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
        this.swipe = (Math.abs(this.swipe - event.clientX) < (this.width * .5)) ? 0 : 1;

        $(sender).css({
            "margin-left": 0,
            "margin-right": 0
        });
    },

    downloadItemTap: function(event, detail, sender) {
        if (this.swipe) alert("swipe", $(sender).attr("tag"));
        else alert("tap", $(sender).attr("tag"));
    }
});
