import moment from 'moment';

Polymer({

  _date(time) {
    return (moment(time).isValid() ? moment(time).format('ddd Do MMM') : moment().format('ddd Do MMM'));
  },

  _icon_class(text) {
    return polymer_color(text ? text : '#');
  },

  _number_string(number) {
    if (9999 < number) {
      return Math.round(number / 1000) + 'K';
    }

    return number;
  },

  _url(e) {
    if (Polymer.dom(e).localTarget.id != 'si') {
      e.stopPropagation();

      document.querySelector('#spinner').toggle();

      Meteor.call('trigger.torrent', this.item._id, (error, res) => {
        document.querySelector('#spinner').toggle();

        if (error) {
          document.querySelector('#toast').toast(error.message);
        } else {
          document.querySelector('#main').set('router.path', '/url/' + res);
        }
      });
    }
  },

  is: 'torrent-item',

});

import '../custom/selectable-icon.js';
