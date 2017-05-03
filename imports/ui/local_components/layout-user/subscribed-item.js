import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import { _project } from '../../../db/projects.js';

Polymer({

  _icon_class(text) {
    return polymer_color(text ? text : '#');
  },

  _icon_text(text) {
    return _.first(text).toUpperCase();
  },

  _item_changed(item) {
    Meteor.subscribe('project', item.split('|'));

    if (this._item_tracker) {
      this._item_tracker.stop();
    }

    this.set('_item_tracker', Tracker.autorun(() => {
      this.set('project', _project.findOne(item, { fields: { query: 1, title: 1, torrent_count: 1 } }));
    }));
  },

  _number_string(number) {
    if (9999 < number) {
      return Math.round(number / 1000) + 'K';
    }

    return number;
  },

  _project(e) {
    if (Polymer.dom(e).localTarget.id != 'si') {
      e.stopPropagation();

      document.querySelector('#spinner').toggle();

      Meteor.call('trigger.project', this.project._id, (error, res) => {
        document.querySelector('#spinner').toggle();

        if (error) {
          document.querySelector('#toast').toast(error.message);
        } else {
          document.querySelector('#main').set('router.path', '/torrent/' + res);
        }
      });
    }
  },

  _query_text(query) {
    let adult_content_filter = !!query.match(/&safe=(0|1)/i);

    let period = query.match(/ added.*?([0-9]+)[a-z] ?/i);
    period = (period ? +period[1] : 999);

    let quality = query.match(/\/([^\/]*)\?/);
    quality = (quality && -1 < quality[1].indexOf('verified') ? 'Very Good' : 'Good');

    let seed = query.match(/ seed.*?([0-9]+) ?/i);
    seed = (seed ? +seed[1] : 0);

    return quality + (period ? ' | Max Period ' + period + 'd' : '') + (seed ? ' | Min Seed' + seed : '') + (adult_content_filter ? ' | No Adult Content' : '');
  },

  is: 'subscribed-item',

  observers: ['_item_changed(item)'],

});

import '../custom/selectable-icon.js';
