throwError = function(text, html) {
    db_error.insert({
        html: html,
        text: text,
        time: moment().format("X")
    });
};

Template.errorHandler.helpers({
    object: function() {
        return db_error.find({}, {
            sort: {
                time: 1
            }
        });
    }
});

Template.error.rendered = function() {
    setInterval(function() {
        db_error.remove({});
    }, 3000);
};
