Meteor.setInterval(function() {
    new fibers(function() {
        torrent_in.find().fetch().forEach(function(item) {
            torrent_in_httpProxyRequest(item);
        });
    }).run();
}, 1000 * 60 * 60 * 4);
