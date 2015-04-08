Template.layout_linto.rendered = function() {

    // $("#main-body").height(window.innerHeight - $("#main-toolbar").height());
    // $("#main-body").width(window.innerWidth);

    // $(window).resize(function() {
    //     $("#main-body").height(window.innerHeight - $("#main-toolbar").height());
    //     $("#main-body").width(window.innerWidth);
    // });

    var torrent_in_localstorage = $("#torrent_in_db").val();
    $("torrentz-menu").attr("list", torrent_in_localstorage);

    var torrent_in_db = JSON.parse(torrent_in_localstorage);

    torrent_in.find().observeChanges({
        added: function(_id, row) {
            var item = _.find(torrent_in_db, function(item) {
                return (item["_id"] == _id);
            });

            if (typeof(item) == "undefined" || item == null) {
                torrent_in_db.push($.extend(true, row, {
                    _id: _id,
                    count: "*",
                    iconClass: polymer_color(row.keyword),
                    iconText: (isNaN(row.keyword.charAt(0)) ? row.keyword.charAt(0).toUpperCase() : "#")
                }));

                $("torrentz-menu").attr("list", JSON.stringify(torrent_in_db));
            }
        },

        changed: function(_id, row) {
            var index = -1;

            var item = _.find(torrent_in_db, function(item) {
                index++;

                return (item["_id"] == _id);
            });

            if (typeof(item) != "undefined" && item != null) {
                $.extend(true, torrent_in_db[index], row);

                $("torrentz-menu").attr("list", JSON.stringify(torrent_in_db));
            }
        },

        removed: function(_id) {
            var index = -1;

            var item = _.find(torrent_in_db, function(item) {
                index++;

                return (item["_id"] == _id);
            });

            if (typeof(item) != "undefined" && item != null) {
                torrent_in_db.splice(index, 1);

                $("torrentz-menu").attr("list", JSON.stringify(torrent_in_db));
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
