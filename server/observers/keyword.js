_worker.find().observe({
    added: function(row) {
        if (row.status == "") {
            switch (row.worker) {
                case "schedule":
                    console.log(row);
                    break;

                case "search":
                    console.log(row);
                    break;
            }
        }
    }
});
