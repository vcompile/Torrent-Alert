Template.inbox.helpers({
    width: function() {
        return (480 < $(window).width()) ? 480 : ($(window).width() - 32);
    }
});
