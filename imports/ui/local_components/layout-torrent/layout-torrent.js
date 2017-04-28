import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import _ from 'underscore';

import { _project } from '../../../db/projects.js';
import { _torrent } from '../../../db/torrents.js';
import { _worker } from '../../../db/workers.js';

Polymer({

  _back() {
    if (this.selected.length) {
      this.set('selected', []);
    } else {
      if (Meteor.isCordova) { navigator.app.backHistory(); }
      else { history.back(); }
    }
  },

  _filter_close() {
    if (this.project.query) {
      let adult_content_filter = !!this.project.query.match(/&safe=(0|1)/i);

      let period = this.project.query.match(/ added.*?([0-9]+)[a-z] ?/i);
      period = (period ? +period[1] : 999);

      let quality = this.project.query.match(/\/([^\/]*)\?/);
      quality = (quality && -1 < quality[1].indexOf('verified') ? 'verified' : 'search');

      let seed = this.project.query.match(/ seed.*?([0-9]+) ?/i);
      seed = (seed ? +seed[1] : 0);

      if (this.adult_content_filter != adult_content_filter || this.period != period || this.quality != quality || this.seed != seed) {
        document.querySelector('#spinner').toggle();

        Meteor.call('insert.project', { query: '/' + this.quality + '?f=' + this.project.title + ' added:' + this.period + 'd seed > ' + this.seed + (this.adult_content_filter ? '&safe=1' : ''), title: this.project.title }, (error, res) => {
          document.querySelector('#spinner').toggle();

          if (error) {
            document.querySelector('#toast').toast(error.message);
          } else {
            document.querySelector('#main').set('router.path', '/torrent/' + res);
          }
        });
      }
    }
  },

  _filter_open() {
    if (this.project.query) {
      this.adult_content_filter = !!this.project.query.match(/&safe=(0|1)/i);

      let period = this.project.query.match(/ added.*?([0-9]+)[a-z] ?/i);
      this.period = (period ? +period[1] : 999);

      let quality = this.project.query.match(/\/([^\/]*)\?/);
      this.quality = (quality && -1 < quality[1].indexOf('verified') ? 'verified' : 'search');

      let seed = this.project.query.match(/ seed.*?([0-9]+) ?/i);
      this.seed = (seed ? +seed[1] : 0);

      this.$.filter.open();
    }
  },

  _remove() {
    if (Meteor.user()) {
      document.querySelector('#spinner').toggle();

      const selected = _.map(this.selected, (item) => {
        return item._id;
      });

      Meteor.call('remove.torrent', selected, (error, res) => {
        document.querySelector('#spinner').toggle();

        if (error) {
          document.querySelector('#toast').toast(error.message);
        } else {
          document.querySelector('#toast').toast(selected.length + ' Item Removed', 'UNDO', { torrent: selected });

          this.set('selected', []);
        }
      });
    } else {
      document.querySelector('#toast').toast('', 'SIGNIN');
    }
  },

  _route_changed(route) {
    if (route.page == 'torrent') {
      Meteor.subscribe('project', route._id.split('|'));

      if (this._project_tracker) {
        this._project_tracker.stop();
      }

      this.set('_project_tracker', Tracker.autorun(() => {
        this.set('project', _project.findOne(route._id, { fields: { query: 1, title: 1, torrent_count: 1 } }));

        if (this.project) {
          this._torrent_subscriber(this.project._id);

          if (this.project.query) {
            this._worker_subscriber(this.project.query);
          }
        }
      }));
    }
  },

  _scroll(e) {
    if (e.detail.target.scrollHeight - (e.detail.target.clientHeight * 1.5) < e.detail.target.scrollTop) {
      this.debounce('_scroll', function () {
        Meteor.subscribe('torrent', { page: ++this.page, project: this.route._id.split('|') });
      }, 1000);
    }
  },

  _sort(A, Z) {
    return (moment(Z.time).unix() - moment(A.time).unix());
  },

  _status(worker = {}) {
    switch (worker.status) {

      case '':
        return 'Indexing';
        break;

      case '200':
        return (this.torrent && this.torrent.length ? 'Updated At ' + (moment(worker.time).isValid() ? moment(worker.time).format('ddd Do MMM') : moment().format('ddd Do MMM')) : 'No Item Found');
        break;

      default:
        return worker.status;
        break;

    }
  },

  _subscribe() {
    if (Meteor.user()) {
      Meteor.users.update(Meteor.user()._id, {
        $addToSet: {
          'profile.subscribed': this.project._id,
        },
      });

      document.querySelector('#toast').toast('1 Item Subscribed', 'UNDO', { undo_subscribe: [this.project._id] });
    } else {
      document.querySelector('#toast').toast('', 'SIGNIN');
    }
  },

  _subscribe_hidden(selected_length, subscribed, project_id) {
    return (selected_length || -1 < subscribed.indexOf(project_id));
  },

  _title(title, length) {
    return length ? length : title;
  },

  _torrent_subscriber(_id) {
    this.page = 1; this.set('torrent', []); Meteor.subscribe('torrent', { page: this.page, project: _id.split('|') });

    if (this._torrent_observer) {
      this._torrent_observer.stop();
    }

    this.set('_torrent_observer', _torrent.find({ project: _id }, { sort: { time: -1 } }).observe({ addedAt: (row) => { this.push('torrent', row); }, changedAt: (row) => { this.splice('torrent', _.findIndex(this.torrent, { _id: row._id }), 1, row); }, removedAt: (row) => { this.splice('torrent', _.findIndex(this.torrent, { _id: row._id }), 1); } }));
  },

  _worker_subscriber(query) {
    Meteor.subscribe('worker', query);

    if (this._worker_tracker) {
      this._worker_tracker.stop();
    }

    this.set('_worker_tracker', Tracker.autorun(() => {
      this.set('worker', _worker.findOne({ query }, { fields: { query: 1, status: 1, time: 1 } }));
    }));
  },

  attached() {
    Tracker.autorun(() => {
      this.set('subscribed', Meteor.user() && Meteor.user().profile && Meteor.user().profile.subscribed ? Meteor.user().profile.subscribed : []);
    });
  },

  is: 'layout-torrent',

  observers: ['_route_changed(route)'],

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

import './torrent-item.js';
