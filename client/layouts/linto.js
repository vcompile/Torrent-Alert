Template.layout_linto.helpers({
    initial_page: 1
});

Template.layout_linto.rendered = function() {

    var torrentz_localstorage = $("#torrentz_db").val();

    $("torrentz-menu").attr("list", torrentz_localstorage);
    $("torrentz-list").attr("list", torrentz_localstorage);

    torrentz_db = JSON.parse(torrentz_localstorage);

    torrent_in.find().observeChanges({
        added: function(_id, row) {
            var item = _.find(torrentz_db, function(item) {
                return (item["_id"] == _id);
            });

            if (typeof(item) == "undefined" || item == null) {
                torrentz_db.push($.extend(true, row, {
                    _id: _id,
                    count: "*",
                    iconClass: polymer_color(row.keyword),
                    iconText: (isNaN(row.keyword.charAt(0)) ? row.keyword.charAt(0).toUpperCase() : "#"),
                    torrent_out: []
                }));

                $("#torrentz_db").val(JSON.stringify(torrentz_db));

                $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
                $("torrentz-list").attr("list", JSON.stringify(torrentz_db));
            }
        },

        removed: function(_id) {
            var index = -1;

            var item = _.find(torrentz_db, function(item) {
                index++;

                return (item["_id"] == _id);
            });

            if (typeof(item) != "undefined" && item != null) {
                torrentz_db.splice(index, 1);

                $("#torrentz_db").val(JSON.stringify(torrentz_db));

                $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
                $("torrentz-list").attr("list", JSON.stringify(torrentz_db));
            }
        }
    });

    torrent_out.find().observeChanges({
        added: function(_id, row) {
            for (var A = 0; A < torrentz_db.length; A++) {
                if (-1 < row.torrent_in.indexOf(torrentz_db[A]._id)) {
                    var index = -1;

                    var item = _.find(torrentz_db[A].torrent_out, function(item) {
                        index++;

                        return (item["_id"] == _id);
                    });

                    if (typeof(item) == "undefined" || item == null) {
                        if (torrentz_db[A].peers < row.peers && torrentz_db[A].seeds < row.seeds) {
                            torrentz_db[A].torrent_out.push($.extend(true, row, {
                                _id: _id,
                                categoryClass: polymer_color(row.category),
                                listClass: "item"
                            }));

                            var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                                return item.listClass == "item";
                            }).length;

                            torrentz_db[A].count = (0 < count) ? count : "*";

                            $("#torrentz_db").val(JSON.stringify(torrentz_db));

                            $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
                            $("torrentz-list").attr("list", JSON.stringify(torrentz_db));
                        }
                    } else {
                        if (row.peers < torrentz_db[A].peers && row.seeds < torrentz_db[A].seeds) {
                            torrentz_db[A].torrent_out.splice(index, 1);

                            var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                                return item.listClass == "item";
                            }).length;

                            torrentz_db[A].count = (0 < count) ? count : "*";

                            $("#torrentz_db").val(JSON.stringify(torrentz_db));

                            $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
                            $("torrentz-list").attr("list", JSON.stringify(torrentz_db));
                        }
                    }
                }
            }
        },

        removed: function(_id) {
            for (var A = 0; A < torrentz_db.length; A++) {
                var index = -1;

                var item = _.find(torrentz_db[A].torrent_out, function(item) {
                    index++;

                    return (item["_id"] == _id);
                });

                if (typeof(item) != "undefined" && item != null) {
                    torrentz_db[A].torrent_out.splice(index, 1);

                    var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                        return item.listClass == "item";
                    }).length;

                    torrentz_db[A].count = (0 < count) ? count : "*";

                    $("#torrentz_db").val(JSON.stringify(torrentz_db));

                    $("torrentz-menu").attr("list", JSON.stringify(torrentz_db));
                    $("torrentz-list").attr("list", JSON.stringify(torrentz_db));
                }
            }
        }
    });

};

Template.layout_linto.events({

    "click #add-keyword": function(event, target) {
        if (Meteor.user()) {
            document.querySelector("add-keyword /deep/ paper-action-dialog").toggle();
        } else {
            if (Accounts.loginServicesConfigured()) {
                Meteor.loginWithGoogle({
                    requestOfflineToken: true,
                    requestPermissions: ["email", "profile"]
                }, function(error) {
                    if (error) throwError(Accounts.LoginCancelledError.numericError, "");
                    else location.reload();
                });
            }
        }
    }

});
