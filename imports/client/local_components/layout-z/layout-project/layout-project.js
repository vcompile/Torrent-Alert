import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const moment = require('moment');
const underscore = require('underscore');

(function() {
  Polymer({

    _add() {
      if (Meteor.user()) {
        Meteor.users.update({
          _id: Meteor.user()._id,
        }, {
          $addToSet: {
            'profile.subscribed': this.project._id,
          },
        });

        document.querySelector('#polymer_toast').toast('subscribed', 'UNDO', { subscribed: [this.project._id] });
      } else {
        document.querySelector("#polymer_toast").toast('', 'SIGNIN');
      }
    },

    _back() {
      if (this.selected.length) {
        this.set('selected', []);
      } else {
        if (Meteor.isCordova) {
          navigator.app.backHistory();
        } else {
          history.back();
        }
      }
    },

    _delete() {
      document.querySelector('#polymer_spinner').toggle();

      let selected = _.map(this.selected, (item) => {
        return item._id;
      });

      let _this = this;

      Meteor.call('remove_torrent', selected, (error, res) => {
        document.querySelector('#polymer_spinner').toggle();

        if (error) {
          document.querySelector('#polymer_toast').toast(error.message);
        } else {
          _this.set('selected', []);

          document.querySelector('#polymer_toast').toast(res, 'UNDO', { torrent: selected });
        }
      });
    },

    _filter() {
      document.querySelector('#app_location').set('path', '/filter/' + this.project._id);
    },

    _layout_project_changed(layout_project) {
      if (layout_project && document.querySelector('#app_location').path.match(/^\/project\//)) {
        layout_project = layout_project.split('|');

        let first = underscore.first(layout_project, 1);
        let rest = underscore.rest(layout_project);

        Meteor.subscribe('project', first);

        if (rest.length) {
          Meteor.subscribe('torrent', { project: first, torrent: rest });
        } else {
          this.page = 1;

          Meteor.subscribe('torrent', { page: this.page, project: first });
        }

        if (this._tracker) {
          this._tracker.stop();
        }

        if (this._observe) {
          this._observe.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          _this.set('project', _project.findOne({ _id: { $in: first } }));
        });

        _this.set('torrent', []);

        _this._observe = _torrent.find(_.extend({ project: { $in: first } }, (rest.length ? { _id: { $in: rest } } : {})), { sort: { time: -1 } }).observe({
          addedAt(row) {
            _this.push('torrent', row);
          },

          changedAt(row) {
            _this.splice('torrent', underscore.findIndex(_this.torrent, { _id: row._id }), 1, row);
          },

          removedAt(row) {
            _this.splice('torrent', underscore.findIndex(_this.torrent, { _id: row._id }), 1);
          },
        });
      }
    },

    _scroll(e) {
      if (e.detail.target.scrollHeight - (e.detail.target.clientHeight * 1.5) < e.detail.target.scrollTop) {
        this.debounce('_scroll', function() {
          let layout_project = this.route.layout_project.split('|');

          if (layout_project.length == 1) {
            Meteor.subscribe('torrent', { page: ++this.page, project: layout_project });
          }
        }, 1000 * 3);
      }
    },

    _selected(length) {
      return (length ? 'hidden' : '');
    },

    _share() {
      let share = '';

      this.selected.forEach((torrent) => {
        share += "\n\n" + torrent.category + "\t\t" + torrent.size + "\t\t" + torrent.title + "\t\t" + Meteor.absoluteUrl('torrent/' + torrent._id) + "\n\n";
      });

      if (share != '') {
        if (Meteor.isCordova) {
          window.plugins.socialsharing.share(share);
        } else {
          window.open('mailto:?subject=' + encodeURIComponent('Torrent Alert') + '&body=' + encodeURIComponent(share), "_system");
        }

        this.set('selected', []);
      }
    },

    _sort(A, Z) {
      return (moment(Z.time).unix() - moment(A.time).unix());
    },

    _status(torrentLength, projectError) {
      if (torrentLength) {
        return torrentLength + ' item';
      } else {
        if (projectError) {
          return projectError;
        } else {
          return 'indexing';
        }
      }
    },

    _subscribed(subscribed, project) {
      return (-1 < subscribed.indexOf(underscore.first(project.split('|'))));
    },

    is: "layout-project",

    observers: ['_layout_project_changed(route.layout_project)'],

    properties: {
      selected: {
        type: Array,
        value() {
          return [];
        },
      },
      torrent: {
        type: Array,
        value() {
          return [];
        },
      },
    },

  });
})();
