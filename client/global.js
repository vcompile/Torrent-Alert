torrentz_db = [];

render = function(opt) {
    opt = opt ? opt : "";

    var json = JSON.stringify(torrentz_db);

    switch (opt) {

        case "update":
            $("torrentz-menu").attr("list", json);

            var group = [],
                group_index = JSON.parse($("torrentz-list").attr("tag"));

            group_index.forEach(function(_id) {
                var index = -1;

                var item = _.find(torrentz_db, function(item) {
                    index++;

                    return (_id == item._id);
                });

                if (item)
                    group.push(item)
            });

            $("torrentz-list").attr("list", (group.length ? JSON.stringify(group) : json));
            break;

        default:
            $("torrentz-menu").attr("list", json);
            $("torrentz-list").attr("list", json);
            break;

    }

    $("#torrentz_db").val(json);
};

undo_hidden_callback = function(_id_torrent_out) {
    _id_torrent_out.forEach(function(_id) {
        for (var A = 0; A < torrentz_db.length; A++) {
            var index = -1;

            var item = _.find(torrentz_db[A].torrent_out, function(item) {
                index++;

                return (_id == item._id);
            });

            if (item) {
                torrentz_db[A].torrent_out[index].listClass = "item";

                var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                    return item.listClass == "item";
                }).length;

                torrentz_db[A].count = (0 < count) ? count : "*";

                render("update");

                break;
            }
        }
    });
};
