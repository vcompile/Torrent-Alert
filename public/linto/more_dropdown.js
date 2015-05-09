Polymer("more-dropdown", {
    store: {},

    display_add: null,
    display_more: "none",

    total_keyword: null,
    selected_torrentz: null,

    addIconTap: function() {
        if (Meteor.user()) {
            document.querySelector("add-keyword /deep/ paper-action-dialog").toggle();
        } else {
            if (Accounts.loginServicesConfigured()) {
                Meteor.loginWithGoogle({
                    requestOfflineToken: true,
                    requestPermissions: ["email", "profile"]
                }, function(error) {
                    if (error) {
                        $("toast-handler").attr("text", Accounts.LoginCancelledError.numericError);
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    } else location.reload();
                });
            }
        }
    },

    deleteButtonTap: function() {
        this.store.delete.forEach(function(_id) {
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
                    break;
                }
            }
        });

        this.display_add = null;
        this.display_more = "none";

        render("update");

        $("toast-handler").attr("text", this.store.delete.length + " item(s) removed");
        $("toast-handler").attr("undo_hidden_callback_opt", "['" + this.store.delete.join("', '") + "']");
    },

    moreIconTap: function() {
        document.querySelector("more-dropdown /deep/ paper-dropdown").toggle();
    },

    storeChanged: function() {
        if (!(this.store instanceof Object))
            this.store = JSON.parse(this.store);

        if (this.store.delete) {
            this.total_keyword = torrentz_db.length;
            this.selected_torrentz = this.store.delete.length;

            this.display_add = "none";
            this.display_more = null;
        } else {
            this.display_add = null;
            this.display_more = "none";
        }
    }
});
