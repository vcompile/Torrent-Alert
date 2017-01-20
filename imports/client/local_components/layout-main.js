(function() {
  Polymer({

    _layout_main_changed(layout_main) {
      if (['filter', 'project', 'torrent'].indexOf(layout_main) == -1 && this.$.layout_inbox.querySelector('paper-scroll-header-panel')) {
        this.$.layout_inbox.querySelector('paper-scroll-header-panel').notifyResize();
      }
    },

    attached() {
      if (!this.router.path || this.router.path == '/') {
        this.set('router.path', '/search/_recent_');
      }

      let _this = this;

      Tracker.autorun(() => {
        if (Meteor.user()) {
          _this.set('user', _.pick(Meteor.user().profile, ['email', 'name', 'picture', 'subscribed']));

          // Meteor.setTimeout(() => {
          if (_this.PN) {
            Meteor.call('insert_PN', _this.PN, (error, res) => {
              if (error) {
                document.querySelector('#polymer_toast').toast(error.message);
              }
            });
          }
          // }, 1000 * 4);
        } else {
          _this.set('user', { email: '', name: '', picture: '', subscribed: [] });
        }
      });
    },

    is: "layout-main",

    observers: ['_layout_main_changed(route.layout_main)'],

    properties: {
      user: {
        type: Object,
        value() {
          return {
            email: '',
            name: '',
            picture: '',
            subscribed: [],
          };
        },
      },
    },

    selected_layout(route) {
      return (-1 < ['filter', 'project', 'torrent'].indexOf(route) ? 'layout-z' : 'layout-inbox');
    },

  });
})();
