import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import { _project } from '../../../db/projects.js';

Polymer({

  _item_changed(item) {
    Meteor.subscribe('project', item.split('|'));

    if (this._item_tracker) {
      this._item_tracker.stop();
    }

    this.set('_item_tracker', Tracker.autorun(() => {
      this.set('project', _project.findOne(item, { fields: { title: 1, torrent_count: 1 } }));
    }));
  },

  _number_string(number) {
    if (9999 < number) {
      return Math.round(number / 1000) + 'K';
    }

    return number;
  },

  _project() {
    if (this.project) {
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

  is: 'search-item',

  observers: ['_item_changed(item)'],

});
