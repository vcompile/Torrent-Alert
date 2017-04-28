import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import moment from 'moment';

import { _url } from '../../../db/urls.js';

Polymer({

  _date(time) {
    return moment(time).isValid() ? moment(time).format('ddd Do MMM') : moment().format('ddd Do MMM');
  },

  _icon_class(text) {
    return polymer_color(text ? text : '#');
  },

  _icon_text(text) {
    return (text ? text.charAt(0).toUpperCase() : '#');
  },

  _item_changed(item) {
    Meteor.subscribe('url', item.split('|'));

    if (this._item_tracker) {
      this._item_tracker.stop();
    }

    this.set('_item_tracker', Tracker.autorun(() => {
      this.set('url', _url.findOne(item, { fields: {} }));
    }));
  },

  _time(time) {
    return moment(time).isValid() ? moment(time).format('h:m A') : moment().format('h:m A');
  },

  is: 'url-item',

  observers: ['_item_changed(item)'],

});

import '../custom/selectable-icon.js';
