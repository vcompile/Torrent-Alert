if (Meteor.isCordova) {
  document.addEventListener("deviceready", function() {
    var _LaunchScreen = LaunchScreen.hold();

    document.addEventListener("WebComponentsReady", function() {
      window.setTimeout(function() {
        _LaunchScreen.release();
      }, 1000);
    }, false);

    document.addEventListener("WebComponentsReady", function() {
      PushNotification.hasPermission(function(res) {
        if (!res.isEnabled) {
          document.querySelector('#polymer_toast').toast('pushAlert permission denied');
        }
      });
    }, false);

    var _PN = PushNotification.init({
      android: {
        clearBadge: true,
        forceShow: true,
        icon: 'ldpi',
        iconColor: '#009688',
        senderID: '731987698101',
      },
      browser: {},
      ios: {},
      windows: {},
    });

    _PN.on('registration', function(res) {
      document.addEventListener("WebComponentsReady", function() {
        document.querySelector('#layout_main').set('PN', res.registrationId);
      }, false);
    });

    _PN.on('notification', function(res) {
      if (document.querySelector('#app_location')) {
        document.querySelector('#app_location').set('path', '/project/' + res.additionalData.project + '|' + res.additionalData.torrent.join('|'));
      } else {
        document.addEventListener("WebComponentsReady", function() {
          document.querySelector('#app_location').set('path', '/project/' + res.additionalData.project + '|' + res.additionalData.torrent.join('|'));
        }, false);
      }
    });

    _PN.on('error', function(e) {
      if (document.querySelector('#polymer_toast')) {
        document.querySelector('#polymer_toast').toast(e.message);
      } else {
        document.addEventListener("WebComponentsReady", function() {
          document.querySelector('#polymer_toast').toast(e.message);
        }, false);
      }
    });

    universalLinks.subscribe('ww8', function(e) {
      var url = new URL(e.url);

      if (url.hostname == 'ww8.herokuapp.com') {
        if (document.querySelector('#app_location')) {
          document.querySelector('#app_location').set('path', url.pathname);
        } else {
          document.addEventListener("WebComponentsReady", function() {
            document.querySelector('#app_location').set('path', url.pathname);
          }, false);
        }
      }
    });

    var moment = require('moment');
    var _exit = moment().toDate();

    document.addEventListener("WebComponentsReady", function() {
      document.addEventListener("backbutton", function() {
        if (moment.duration(moment().diff(_exit)).asSeconds() < 1) {
          document.querySelector("#polymer_toast").toast('Are you sure you want to exit ?', 'EXIT');
        } else {
          navigator.app.backHistory();
        }

        _exit = moment().toDate();
      }, false);
    }, false);
  }, false);
}
