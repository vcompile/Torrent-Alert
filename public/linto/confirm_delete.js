Polymer("confirm-delete", {
    okButtonTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        var index = -1;

        var item = _.find(torrentz_db, function(item) {
            index++;

            return (item["_id"] == _id);
        });

        if (typeof(item) != "undefined" || item != null) {
            torrentz_db.splice(index, 1);

            $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
            $("torrentz-list").attr("list", JSON.stringify(torrentz_db));

            if (torrentz_db.length == 0)
                document.querySelector("core-animated-pages").selected = 0;

            $("#torrentz_db").val(JSON.stringify(torrentz_db));

            Meteor.call("remove_torrent_in", _id, function(error, status) {
                if (error) throwError(error.reason, "");
                else console.log(status);
            });
        }
    }
});
