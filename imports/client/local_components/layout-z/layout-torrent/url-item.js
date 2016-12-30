const moment = require('moment');

(function() {
  Polymer({

    _date(time) {
      return moment(time).isValid() ? moment(time).format('MMM Do ddd') : moment().format('MMM Do ddd');
    },

    _icon_class(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return polymer_color(match ? match[2] : '#');
    },

    _icon_text(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return (match ? match[2].charAt(0) : '#');
    },

    _text(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return (match ? match[2] : '#');
    },

    _time(time) {
      return moment(time).isValid() ? moment(time).format('h:m A') : moment().format('h:m A');
    },

    is: "url-item",

  });
})();
