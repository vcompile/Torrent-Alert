const moment = require('moment');

(function() {
  Polymer({

    _date(time) {
      return (moment(time).isValid() ? moment(time).format('MMM Do ddd') : moment().format('MMM Do ddd'));
    },

    _icon_class(text) {
      return polymer_color(text ? text : '#');
    },

    _icon_text(length) {
      return (length ? length : '#');
    },

    _torrent(e) {
      if (Polymer.dom(e).localTarget.id != 'selectable_icon') {
        e.stopPropagation();

        document.querySelector('#polymer_spinner').toggle();

        Meteor.call('trigger_torrent', this.item._id, (error, res) => {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast(error.message);
          } else {
            document.querySelector('#app_location').set('path', '/torrent/' + res);
          }
        });
      }
    },

    _very_good(very_good) {
      return (very_good ? 'very_good' : '');
    },

    is: "torrent-item",

  });
})();
