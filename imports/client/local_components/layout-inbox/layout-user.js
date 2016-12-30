import { Meteor } from 'meteor/meteor';

(function() {
  Polymer({

    _email(email) {
      return email ? email : 'Synchronize with Google Account';
    },

    _google() {
      if (Meteor.status().connected) {
        if (Meteor.user()) {
          document.querySelector("#polymer_toast").toast('', 'SIGNOUT');
        } else {
          this.google();
        }
      } else {
        document.querySelector('#polymer_toast').toast('lost server connection');
      }
    },

    _name(name) {
      return name ? name : 'Google Account';
    },

    _picture(picture) {
      return picture ? picture : '/png/google-plus.png';
    },

    google() {
      if (Meteor.isCordova) {
        document.querySelector('#polymer_spinner').toggle();

        Meteor.cordova_g_plus({
          cordova_g_plus: true,
          profile: ['email', 'email_verified', 'family_name', 'gender', 'given_name', 'locale', 'name', 'picture'],
          webClientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com',
        }, function(error) {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast(error);
          }
        });
      } else {
        document.querySelector('#polymer_spinner').toggle();

        Meteor.loginWithGoogle({
          requestOfflineToken: true,
          requestPermissions: ['email', 'profile']
        }, function(error) {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast('google errorNo - ' + Accounts.LoginCancelledError.numericError);
          }
        });
      }
    },

    is: 'layout-user',

  });
})();
