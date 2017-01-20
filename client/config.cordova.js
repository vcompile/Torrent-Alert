if (Meteor.isCordova) {
  let STORE = {};

  let POLYMER_READY = () => {
    if (STORE.TOAST) {
      document.querySelector('#polymer_toast').toast(STORE.TOAST);
    }

    if (STORE.PN) {
      document.querySelector('#layout_main').set('PN', STORE.PN);
    }

    if (STORE.PATH) {
      document.querySelector('#app_location').set('path', STORE.PATH);
    }

    let _back = 1;

    document.addEventListener("backbutton", () => {
      if (1 < _back++) {
        document.querySelector("#polymer_toast").toast('Are you sure you want to exit ?', 'EXIT');
      } else {
        navigator.app.backHistory();
      }

      Meteor.setTimeout(() => {
        _back = 1;
      }, 400);
    }, false);

    Meteor.setTimeout(() => {
      STORE.LS.release();
    }, 1000);
  };

  let CORDOVA_READY = () => {
    STORE.LS = LaunchScreen.hold();

    PushNotification.hasPermission((res) => {
      if (res.isEnabled) {
        let _PN = PushNotification.init({
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

        _PN.on('registration', (e) => {
          if (document.querySelector('#layout_main')) {
            document.querySelector('#layout_main').set('PN', e.registrationId);
          } else {
            STORE.PN = e.registrationId;
          }
        });

        _PN.on('notification', (e) => {
          if (document.querySelector('#app_location')) {
            document.querySelector('#app_location').set('path', '/project/' + e.additionalData.project + '|' + e.additionalData.torrent.join('|'));
          } else {
            STORE.PATH = '/project/' + e.additionalData.project + '|' + e.additionalData.torrent.join('|');
          }
        });

        _PN.on('error', (e) => {
          if (document.querySelector('#polymer_toast')) {
            document.querySelector('#polymer_toast').toast(e.message);
          } else {
            STORE.TOAST = e.message;
          }
        });
      } else {
        STORE.TOAST = 'pushAlert permission denied';
      }
    });

    universalLinks.subscribe('ww8', (e) => {
      let url = new URL(e.url);

      if (url.hostname == 'ww8.herokuapp.com' && url.pathname != '/proxy') {
        if (document.querySelector('#app_location')) {
          document.querySelector('#app_location').set('path', url.pathname);
        } else {
          STORE.PATH = url.pathname;
        }
      } else {
        window.open(e.url, '_system');
      }
    });

    document.addEventListener('WebComponentsReady', POLYMER_READY, false);
  };

  document.addEventListener('deviceready', CORDOVA_READY, false);
}
