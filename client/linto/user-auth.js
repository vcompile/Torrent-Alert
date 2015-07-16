Template.signIn.helpers({
    loading: function() {
        return !Session.get("polymer-ready");
    }
});
