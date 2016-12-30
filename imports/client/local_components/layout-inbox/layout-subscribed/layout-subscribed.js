import { Meteor } from 'meteor/meteor';

const underscore = require('underscore');

(function() {
  Polymer({

    _status(length) {
      if (length) {
        return length + ' item';
      } else {
        return 'noItemFound';
      }
    },

    _user_changed(user) {
      if (user.subscribed) {
        this.set('project', []);

        Meteor.subscribe('project', user.subscribed);

        if (this._observer) {
          this._observer.stop();
        }

        let _this = this;

        _this._observer = _project.find({
          _id: {
            $in: user.subscribed,
          },
        }).observe({
          addedAt(row) {
            _this.push('project', row);
          },

          changedAt(row) {
            _this.splice('project', underscore.findIndex(_this.project, { _id: row._id }), 1, row);
          },

          removedAt(row) {
            _this.splice('project', underscore.findIndex(_this.project, { _id: row._id }), 1);
          },
        });
      }
    },

    is: "layout-subscribed",

    observers: ['_user_changed(user)'],

  });
})();
