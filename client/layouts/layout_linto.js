Template.layout_linto.helpers({
    initial_page: 1
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

                if (document.querySelector("core-animated-pages").selected == 0) {
                    document.querySelector("core-animated-pages").selected = 1;

                    render();
                } else render("update");

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
                else render("update");
            }
        }
    });

    function torrentz_db_loop_torrent_out(index) {
        var count = 0,
            lastEntry = 0;

        for (var A = 0; A < torrentz_db[index].torrent_out.length; A++) {
            if (torrentz_db[index].torrent_out[A].listClass == "item") {
                count += 1;

                var time = parseInt(torrentz_db[index].torrent_out[A].time);
                if (lastEntry < time) lastEntry = time;
            }
        }

        torrentz_db[index].count = (0 < count) ? count : "*";
        if (0 < lastEntry) torrentz_db[index].lastEntry = moment(lastEntry, "X").format("Do MMM YY")
    };

    var torrentz_db_queue_torrent_out = [];

    Meteor.setInterval(function() {
        if (torrentz_db_queue_torrent_out.length) {
            torrentz_db_queue_torrent_out = _.uniq(torrentz_db_queue_torrent_out);

            while (torrentz_db_queue_torrent_out.length) {
                torrentz_db_loop_torrent_out(torrentz_db_queue_torrent_out.pop());
            }

            render("update");
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
                        torrentz_db[group_index].torrent_out = _.sortBy(torrentz_db[group_index].torrent_out, "time").reverse();
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

        changed: function(_id, row) {
            var row = torrent_out.findOne({
                _id: _id
            });

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

                if (item) {
                    if (row.peers < torrentz_db[group_index].peers && row.seeds < torrentz_db[group_index].seeds) torrentz_db[group_index].torrent_out.splice(index, 1);
                    else torrentz_db[group_index].torrent_out[index] = _.extend(torrentz_db[group_index].torrent_out[index], row);

                    torrentz_db_queue_torrent_out.push(group_index);
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

    Meteor.autorun(function() {
        if (Meteor.status().connected) {
            $("toast-handler").attr("text", "Server connected");
            $("toast-handler").attr("undo_hidden_callback_opt", "");
        } else {
            switch (Meteor.status().status) {

                case "offline":
                    $("toast-handler").attr("text", "Server offline");
                    $("toast-handler").attr("undo_hidden_callback_opt", "");
                    break;

                case "waiting":
                    $("toast-handler").attr("text", "Server waiting");
                    $("toast-handler").attr("undo_hidden_callback_opt", "");
                    break;

            }
        }
    });

};

Template.layout_linto.events({

    "click #menu-l-toggle": function(event, target) {
        if (768 < $("html /deep/ #drawer-panel").width()) document.querySelector("html /deep/ #drawer-panel").forceNarrow = !document.querySelector("html /deep/ #drawer-panel").forceNarrow;
        else document.querySelector("html /deep/ #drawer-panel").togglePanel();
    },

    "click #c-panel-open": function(event, target) {
        if (Meteor.user()) {
            document.querySelector("c-panel /deep/ paper-action-dialog").open();
        } else {
            if (Meteor.isCordova) {
                Meteor.cordovaSignIn({
                    cordova_g_plus: true,
                    profile: ["email", "email_verified", "gender", "locale", "name", "picture", "sub"]
                });
            } else {
                if (Accounts.loginServicesConfigured()) {
                    Meteor.loginWithGoogle({
                        requestOfflineToken: true,
                        requestPermissions: ["email", "profile"]
                    }, function(error) {
                        if (error) {
                            $("toast-handler").attr("text", Accounts.LoginCancelledError.numericError);
                            $("toast-handler").attr("undo_hidden_callback_opt", "");
                        } // else location.reload();
                    });
                }
            }
        }
    }

});
