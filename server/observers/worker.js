_worker.find().observe({
    added: function(row) {
        if (row.status == "") {
            switch (row.type) {
                case "schedule":
                    _crawler("schedule");
                    break;

                case "search":
                    _crawler("search");
                    break;

                case "torrent":
                    _crawler("torrent");
                    break;
            }
        }
    }
});
