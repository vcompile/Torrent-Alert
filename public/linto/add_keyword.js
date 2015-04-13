Polymer("add-keyword", {
    keyword: "",

    seeds: 10,
    peers: 100,

    okButtonTap: function(event, detail, sender) {
        this.keyword = unescape(this.keyword).trim();

        var keywordArray = this.keyword.replace("/", "").split("?f=");

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
                if (error) toast(error.reason);
                else {
                    if (status) toast("1 keyword added");
                    else toast("Quota limit reached");
                }
            });
        } else toast("Empty keyword", "");
    }
});
