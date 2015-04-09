torrentz_db = [];

throwError = function(text, callback) {
    $("body").append('<paper-toast duration="4000" opened text="' + text + '">' + (callback ? '<div style="color: #FFEB3B;" onclick="' + callback + '">undo</div>' : '') + '</paper-toast>');
};

undo_hidden = function(_id) {
    for (var A = 0; A < torrentz_db.length; A++) {
        var index = -1;

        var item = _.find(torrentz_db[A].torrent_out, function(item) {
            index++;

            return (item["_id"] == _id);
        });

        if (typeof(item) != "undefined" && item != null) {
            torrentz_db[A].torrent_out[index].listClass = "item";

            var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                return item.listClass == "item";
            }).length;

            torrentz_db[A].count = (0 < count) ? count : "*";

            $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
            $("torrentz-list").attr("list", JSON.stringify(torrentz_db));

            $("#torrentz_db").val(JSON.stringify(torrentz_db));
        }
    }
};
