Template.signIn.helpers({
    loading: function() {
        return (!Meteor.loggingIn() && Session.get("polymer-ready")) ? false : true;
    }
});
