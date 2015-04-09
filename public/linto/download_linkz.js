Polymer("download-linkz", {
    body: null,
    header: null,

    bodyChanged: function() {
        this.$.body.innerHTML = this.body;
    },

    headerChanged: function() {
        this.$.header.innerHTML = this.header;
    }
});
