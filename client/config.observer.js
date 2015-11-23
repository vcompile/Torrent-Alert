_worker.find().observe({
    added: function(row) {
        project_progress();
    },

    removed: function(old) {
        project_progress();
    }
});
