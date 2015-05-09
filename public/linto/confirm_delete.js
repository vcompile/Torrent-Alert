Polymer("confirm-delete", {
    store: [],

    okButtonTap: function(event, detail, sender) {
        this.store.forEach(function(_id) {
            var index = -1;

            var item = _.find(torrentz_db, function(item) {
                index++;

                return (_id == item._id);
            });

            if (item) {
                torrentz_db.splice(index, 1);

                if (torrentz_db.length == 0)
                    document.querySelector("core-animated-pages").selected = 0;

                render("update");

                Meteor.call("remove_torrent_in", _id, function(error, status) {
                    if (error) {
                        $("toast-handler").attr("text", error.reason);
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    } else {
                        $("toast-handler").attr("text", "1 keyword deleted");
                        $("toast-handler").attr("undo_hidden_callback_opt", "");
                    }
                });
            }
        });
    }
});
