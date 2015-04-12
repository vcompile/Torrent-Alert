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

                torrentz_db = _.sortBy(torrentz_db, "keyword");

                if (document.querySelector("core-animated-pages").selected == 0) document.querySelector("core-animated-pages").selected = 1;
                else {
                    if ($("torrentz-list").attr("tag") == "") re_render();
                    else re_render("torrentz_menu");
                }

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

                if (torrentz_db.length == 0) document.querySelector("core-animated-pages").selected = 0;
                else {
                    if ($("torrentz-list").attr("tag") == "") re_render();
                    else re_render("torrentz_menu");
                }
            }
        }
    });

    function torrentz_db_loop_torrent_out(index) {
        var count = 0;

        var data = {},
            keyword = torrentz_db[index].keyword.trim().replace(/\s+/g, " ").toLowerCase();

        for (var A = 0; A < torrentz_db[index].torrent_out.length; A++) {
            if (torrentz_db[index].torrent_out[A].listClass == "item") {
                count++;

                var key = torrentz_db[index].torrent_out[A].title.toLowerCase().split(keyword, 1)[0].replace(/20[0-5]{2}/g, "").trim().replace(/\s+/g, " ");

                if (data[key]) {
                    data[key].count += 1;

                    data[key].group.push({
                        index: A,
                        ratio: torrentz_db[index].torrent_out[A].seeds / torrentz_db[index].torrent_out[A].peers,
                        size: torrentz_db[index].torrent_out[A].size
                    });
                } else {
                    data[key] = {
                        count: 1,
                        group: [{
                            index: A,
                            ratio: torrentz_db[index].torrent_out[A].seeds / torrentz_db[index].torrent_out[A].peers,
                            size: torrentz_db[index].torrent_out[A].size
                        }]
                    };
                }
            }
        }

        torrentz_db[index].count = (0 < count) ? count : "*";

        _.filter(data, function(item) {
            return (1 < item.count);
        }).forEach(function(item) {
            var ratio = _.sortBy(item.group, "ratio");

            for (var A = 0; A < ratio.length; A++)
                torrentz_db[index].torrent_out[ratio[A].index].ratio_index = A;

            var size = _.sortBy(item.group, "size");

            for (var A = 0; A < size.length; A++)
                torrentz_db[index].torrent_out[size[A].index].size_index = A;
        });
    };

    var torrentz_db_queue_torrent_out = [];

    Meteor.setInterval(function() {
        if (torrentz_db_queue_torrent_out.length) {
            torrentz_db_queue_torrent_out = _.uniq(torrentz_db_queue_torrent_out);

            torrentz_db_queue_torrent_out.forEach(function(index) {
                torrentz_db_loop_torrent_out(index);
            });

            torrentz_db_queue_torrent_out = [];

            if ($("torrentz-list").attr("tag") == "") re_render();
            else re_render("torrentz_menu");
        }
    }, 1000 * 60);

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
                        torrentz_db[group_index].torrent_out = _.sortBy(torrentz_db[group_index].torrent_out, "title");
                        torrentz_db_queue_torrent_out.push(group_index);
                    }
                } else {
                    if (row.peers < torrentz_db[group_index].peers && row.seeds < torrentz_db[group_index].seeds) {
                        torrentz_db[group_index].torrent_out.splice(index, 1);
                        torrentz_db_queue_torrent_out.push(group_index);
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
                    torrentz_db_queue_torrent_out.push(A);

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
