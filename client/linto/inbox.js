Template.inbox.helpers({
    width: function() {
        if (Session.get("width") && !isNaN(Session.get("width"))) return Session.get("width");
        else return (480 < $(window).width()) ? 480 : ($(window).width() - 32);
    }
});

Template.inbox.rendered = function() {
    $(window).on("resize", _.debounce(function() {
        Session.set("width", ((480 < $(window).width()) ? 480 : ($(window).width() - 32)));
    }, 400));
};
