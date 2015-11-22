project_progress = function() {
    $(".project_progress").attr("hidden", true);

    var A = {};

    _worker.find().fetch().forEach(function(item) {
        _key(A, [item.project]);
    });

    _.each(A, function(value, key, list) {
        var project = _project.findOne({
            _id: key
        });

        if (project) {
            if (document.querySelector('.project_progress[data-id="' + key + '"]')) {
                var project_progress = document.querySelector('.project_progress[data-id="' + key + '"]');

                project_progress.hidden = false;

                project_progress.max = project.torrent.length;
                project_progress.value = (project.torrent.length < value ? 25 : Math.abs(project.torrent.length - value));
            }
        }
    });
};

project_save = function() {
    if (document.querySelector("layout-inbox")) {
        document.querySelector("#torrent_db").value = document.querySelector("layout-inbox").project;
    }
};
