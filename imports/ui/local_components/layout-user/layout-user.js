import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  _back() {
    if (this.selected.length) {
      this.set('selected', []);
    } else {
      if (Meteor.isCordova) { navigator.app.backHistory(); }
      else { history.back(); }
    }
  },

  _push_changed(new_value, old_value) {
    if (old_value !== undefined) {
      (window.OneSignal || []).push(['setSubscription', new_value]);
    }
  },

  _remove() {
    // Meteor.users.update(Meteor.user()._id, {
    //   $pull: {
    //     'profile.subscribed': {
    //       $in: this.selected,
    //     },
    //   }
    // });

    this.selected.forEach((_id) => {
      Meteor.users.update(Meteor.user()._id, {
        $pull: {
          'profile.subscribed': _id,
        },
      });
    });

    document.querySelector('#toast').toast(this.selected.length + ' Item Removed', 'UNDO', { redo_subscribe: this.selected });

    this.set('selected', []);
  },

  _SIGNOUT() {
    document.querySelector('#toast').toast('', 'SIGNOUT');
  },

  attached() {
    Tracker.autorun(() => {
      const OneSignal = window.OneSignal || [];

      if (Meteor.user()) {
        OneSignal.push(() => { if (!OneSignal.isPushNotificationsSupported()) { return; } OneSignal.isPushNotificationsEnabled((push) => { this.push = push; OneSignal.sendTags({ user: Meteor.user()._id }); }); OneSignal.registerForPushNotifications(); OneSignal.on('subscriptionChange', (push) => { this.push = push; OneSignal.sendTags({ user: Meteor.user()._id }); }); });
      } else {
        OneSignal.push(() => { if (!OneSignal.isPushNotificationsSupported()) { return; } OneSignal.deleteTags(['user']); });
      }

      this.set('user', Meteor.user() ? Meteor.user().profile : null);
    });
  },

  is: 'layout-user',

  properties: {
    push: {
      observer: '_push_changed',
      type: Boolean,
    },
    selected: {
      type: Array,
      value() {
        return [];
      },
    }
  },

});

import './subscribed-item.js';
import '../custom/selectable-icon.js';
