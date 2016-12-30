(function() {
  Polymer({

    _delete() {
      switch (this.route.layout_inbox) {
        case 'subscribed':
          let selected_subscribed = _.map(this.selected_subscribed, (item) => {
            return item._id;
          });

          // Meteor.users.update({
          //   _id: Meteor.user()._id,
          // }, {
          //   $pull: {
          //     'profile.subscribed': {
          //       $in: selected_subscribed,
          //     },
          //   },
          // });

          selected_subscribed.forEach((_id) => {
            Meteor.users.update({
              _id: Meteor.user()._id,
            }, {
              $pull: {
                'profile.subscribed': _id,
              },
            });
          });

          document.querySelector('#polymer_toast').toast('removed', 'UNDO', { un_subscribed: selected_subscribed });

          this.set('selected_subscribed', []);
          break;
      }
    },

    _info() {
      window.open('https://github.com/HedCET/Torrent-Alert/wiki', '_system');
    },

    _hidden(value) {
      return !!value;
    },

    is: "layout-inbox",

    properties: {
      selected_subscribed: {
        type: Array,
        value() {
          return [];
        },
      },
    },

  });
})();
