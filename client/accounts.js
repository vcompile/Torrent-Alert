_done = null;

Accounts.onResetPasswordLink((token, done) => {
  if (Meteor.user()) {
    Meteor.logout();
  }

  Meteor.setTimeout(() => {
    FlowRouter.go("/user-account", {}, {
      token: token,
      route: 'reset-password',
      previous: Base64.encode(ascii_array(FlowRouter.current().path)),
    });
  }, 1000);

  _done = done;
});
