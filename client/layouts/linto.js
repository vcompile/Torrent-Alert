Template.layout_linto.helpers({
    initial_page: 1,
    meteorStatus: function() {
        return Meteor.status().connected;
    }
});

Template.layout_linto.rendered = function() {

    var torrentz_localstorage = $("#torrentz_db").val();

    $("torrentz-menu").attr("list", torrentz_localstorage);
    $("torrentz-list").attr("list", torrentz_localstorage);

    torrentz_db = JSON.parse(torrentz_localstorage);

    if (torrentz_db.length == 0)
        document.querySelector("core-animated-pages").selected = 0;

    torrent_in.find().observeChanges({
        added: function(_id, row) {
            var item = _.find(torrentz_db, function(item) {
                return (_id == item._id);
            });

            if (typeof(item) == "undefined") {
                torrentz_db.push($.extend(true, row, {
                    _id: _id,
                    count: "*",
                    iconClass: polymer_color(row.keyword),
                    iconText: (isNaN(row.keyword.charAt(0)) ? row.keyword.charAt(0).toUpperCase() : "#"),
                    torrent_out: []
                }));

                if (document.querySelector("core-animated-pages").selected == 0)
                    document.querySelector("core-animated-pages").selected = 1;

                re_render();

                Meteor.subscribe("torrent_out", {
                    torrent_in: _.map(torrentz_db, function(item) {
                        return item._id
                    })
                });
            }
        },

        removed: function(_id) {
            var index = -1;

            var item = _.find(torrentz_db, function(item) {
                index++;

                return (_id == item._id);
            });

            if (item) {
                torrentz_db.splice(index, 1);

                if (torrentz_db.length == 0)
                    document.querySelector("core-animated-pages").selected = 0;

                re_render()
            }
        }
    });

    torrent_out.find().observeChanges({
        added: function(_id, row) {
            var group_index = -1;

            var group = _.find(torrentz_db, function(item) {
                group_index++;

                return (-1 < row.torrent_in.indexOf(item._id));
            });

            if (group) {
                var index = -1;

                var item = _.find(torrentz_db[group_index].torrent_out, function(item) {
                    index++;

                    return (_id == item._id);
                });

                if (typeof(item) == "undefined") {
                    if (torrentz_db[group_index].peers < row.peers && torrentz_db[group_index].seeds < row.seeds) {
                        torrentz_db[group_index].torrent_out.push($.extend(true, row, {
                            _id: _id,
                            categoryClass: polymer_color(row.category),
                            listClass: "item"
                        }));

                        var count = _.filter(torrentz_db[group_index].torrent_out, function(item) {
                            return item.listClass == "item";
                        }).length;

                        torrentz_db[group_index].count = (0 < count) ? count : "*";

                        re_render();
                    }
                } else {
                    if (row.peers < torrentz_db[group_index].peers && row.seeds < torrentz_db[group_index].seeds) {
                        torrentz_db[group_index].torrent_out.splice(index, 1);

                        var count = _.filter(torrentz_db[group_index].torrent_out, function(item) {
                            return item.listClass == "item";
                        }).length;

                        torrentz_db[group_index].count = (0 < count) ? count : "*";

                        re_render();
                    }
                }
            }
        },

        removed: function(_id) {
            for (var A = 0; A < torrentz_db.length; A++) {
                var index = -1;

                var item = _.find(torrentz_db[A].torrent_out, function(item) {
                    index++;

                    return (_id == item._id);
                });

                if (item) {
                    torrentz_db[A].torrent_out.splice(index, 1);

                    var count = _.filter(torrentz_db[A].torrent_out, function(item) {
                        return item.listClass == "item";
                    }).length;

                    torrentz_db[A].count = (0 < count) ? count : "*";

                    re_render();

                    break;
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
                    if (error) toast(Accounts.LoginCancelledError.numericError);
                    else location.reload();
                });
            }
        }
    }

});
