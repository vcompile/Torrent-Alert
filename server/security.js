var accounts_methods = [
  'ATCreateUserServer',
  'ATRemoveService',
  'ATResendVerificationEmail',
  'changePassword',
  'configureLoginService',
  'createUser',
  'forgotPassword',
  'getNewToken',
  'login',
  'logout',
  'logoutOtherClients',
  'removeOtherTokens',
  'resetPassword',
  'verifyEmail',
];

if (Meteor.isServer) {
  DDPRateLimiter.addRule({
    connectionId: function() {
      return true;
    },
    name: function(name) {
      return _.contains(accounts_methods, name);
    },
  }, 1, 1000 * 10);
}

Meteor.users.deny({
  update: function() {
    return true;
  },
});
