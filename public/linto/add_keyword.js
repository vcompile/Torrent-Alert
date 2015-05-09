Polymer("add-keyword", {
    keyword: "",

    seeds: 10,
    peers: 100,

    okButtonTap: function(event, detail, sender) {
        this.keyword = unescape(this.keyword).trim();

        var keywordArray = this.keyword.replace("/", "").split(/\?[a-z]=/g);

        if (this.keyword.length) {
            var row = {
                keyword: (1 < keywordArray.length) ? keywordArray[1] : keywordArray[0],
                peers: this.peers,
                seeds: this.seeds,
                url: "http://torrentz.in",
                urlPart: (1 < keywordArray.length) ? keywordArray[0] : "search"
            };

            this.keyword = "";

            this.seeds = 10;
            this.peers = 100;

            Meteor.call("insert_torrent_in", row, function(error, status) {
                if (error) {
                    $("toast-handler").attr("text", error.reason);
                    $("toast-handler").attr("undo_hidden_callback_opt", "");
                } else {
                    if (status) {
                        $("toast-handler").attr("text", "1 keyword added");
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    } else {
                        $("toast-handler").attr("text", "Quota limit reached");
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    }
                }
            });
        } else {
            $("toast-handler").attr("text", "Empty keyword");
            $("toast-handler").attr("undo_hidden_callback_opt", "");
        }
    }
});
