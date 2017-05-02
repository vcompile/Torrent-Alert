Polymer({

  attached() {
    this.async(() => {
      if (!this.router.path || this.router.path == '/') {
        this.set('router.path', '/search/recent');
      }

      this.$.spinner.toggle();
    });
  },

  is: 'layout-main',

});

import './custom/polymer-spinner.js';
import './custom/polymer-toast.js';

import './layout-search/layout-search.js';
import './layout-torrent/layout-torrent.js';
import './layout-url/layout-url.js';
import './layout-user/layout-user.js';
