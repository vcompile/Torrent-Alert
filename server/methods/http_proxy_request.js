http_proxy = function(row) {
    http_proxy_request_queue.push(row);

    if (http_proxy_request_queue.length) {
        http_proxy_request(http_proxy_request_queue.pop());
    }
};

// http_proxy_request

http_proxy_request_queue = [];

torrent_in_http_proxy_request = function(row) {
    if (row.user_id.length) {
        http_proxy(row);
    } else {
        torrent_in.remove({
            _id: row._id
        });

        torrent_out.find({
            torrent_in: row._id
        }).forEach(function(A) {
            torrent_out.update({
                _id: A._id
            }, {
                $pull: {
                    torrent_in: row._id
                }
            });
        });
    }
};

torrent_out_http_proxy_request = function(row) {
    if (row.torrent_in.length) {
        var _user_id = [];

        row.torrent_in.forEach(function(id) {
            var A = torrent_in.findOne({
                _id: id
            });

            if (A) {
                _user_id = _user_id.concat(A.user_id);
            } else {
                torrent_out.update({
                    _id: row._id
                }, {
                    $pull: {
                        torrent_in: id
                    }
                });
            }
        });

        if (_.difference(_.uniq(_user_id), row.hidden).length) {
            http_proxy(row);
        } else {
            torrent_out.remove({
                _id: row._id
            });
        }
    } else {
        torrent_out.remove({
            _id: row._id
        });
    }
};
