_done = null;

Accounts.onResetPasswordLink(function(token, done) {
  if (Meteor.user()) {
    Meteor.logout();
  }

  Meteor.setTimeout(function() {
    FlowRouter.go("/user-account", {}, {
      token: token,
      route: 'reset-password',
      previous: Base64.encode(ascii_array(FlowRouter.current().path)),
    });
  }, 1000);

  _done = done;
});
