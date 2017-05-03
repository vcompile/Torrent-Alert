Meteor.startup(() => {
  import '../imports/server/config/google.js';
});

import '../imports/server/config/accounts.js';
import '../imports/server/config/emails.js';

import '../imports/server/methods/keyword.js';
import '../imports/server/methods/project.js';
import '../imports/server/methods/torrent.js';

import '../imports/server/scheduler/project.js';
