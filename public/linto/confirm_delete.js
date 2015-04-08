Polymer("confirm-delete", {
    okButtonTap: function(event, detail, sender) {
        var _id = $(sender).attr("tag");

        var head = JSON.parse($("#torrent_in_db").val()),
            list = JSON.parse($("#torrent_out_db").val());

        var index = -1;

        var item = _.find(head, function(item) {
            index++;

            return (item["_id"] == _id);
        });

        if (typeof(item) != "undefined" || item != null) {
            head.splice(index, 1);
            list.splice(index, 1);

            $("torrentz-list").attr("head", JSON.stringify(head));
            $("torrentz-list").attr("list", JSON.stringify(list));

            if (list.length == 0) document.querySelector("core-animated-pages").selected = 0;
            else document.querySelector("core-animated-pages").selected = 1;

            Meteor.call("remove_torrent_in", _id, function(error, status) {
                if (error) throwError(error.reason, "");
                else console.log(status);
            });
        } else throwError("item notFound", "");
    }
});
