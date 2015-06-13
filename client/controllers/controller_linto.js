Template.controller_linto.helpers({
    enable_layout_linto: function() {
        return (JSON.parse($("#torrentz_db").val()).length || Meteor.loggingIn() || Meteor.user()) ? true : false;
    }
});
