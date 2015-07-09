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
