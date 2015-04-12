torrentz_db = [];

toast = function(text, html) {
    $("body").append('<paper-toast duration="2000" opened text="' + text + '">' + (html ? html : '') + '</paper-toast>');
};

undo_hidden_callback = function(_id) {
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

            re_render();

            break;
        }
    }
};

re_render = function(opt) {
    opt = opt ? opt : "";

    var json = JSON.stringify(torrentz_db);

    $("torrentz-menu").attr("list", json);
    if (opt == "") $("torrentz-list").attr("list", json);

    $("#torrentz_db").val(json);
};
