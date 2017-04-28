import { Accounts } from 'meteor/accounts-base';

Accounts.config({
  loginExpirationInDays: null,
});

Accounts.onCreateUser((opts, user) => {
  if (user.services.google && user.services.google.accessToken) {
    var res = Meteor.http.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'User-Agent': 'Meteor/1.0',
      },
      params: {
        access_token: user.services.google.accessToken,
      },
    });

    if (res.error) {
      throw res.error;
    } else {
      if (res.statusCode == 200) {
        user.profile = _.pick(res.data, ['email', 'email_verified', 'family_name', 'gender', 'given_name', 'locale', 'name', 'picture']);
      } else {
        throw new Meteor.Error(422, "google.accessToken FAILED in Accounts.onCreateUser()");
      }
    }
  }

  return user;
});
