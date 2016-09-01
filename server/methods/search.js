Meteor.methods({

  search_keyword: function(input) {
    // this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, String);

    if (input.trim()) {
      var proxy = Random.choice(_proxy),
        torrentz_url = Random.choice(_torrentz_url) + "/suggestions.php?q=" + input.replace(/\s+/, '+');

      try {
        var req = HTTP.call("GET", torrentz_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
          },
          npmRequestOptions: {
            proxy: proxy,
          },
          timeout: 1000 * 30,
        });

        if (req.statusCode === 200) {
          return _.uniq(_.flatten(JSON.parse(req.content)));
        } else {
          console.log('search_keyword', proxy, torrentz_url, req);
        }
      } catch (e) {
        console.log('search_keyword', proxy, torrentz_url, e);
      }
    }

    return [];
  },

  search_keyword_x: function(input) {
    // this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, "userNotFound");

    check(input, String);

    var search = [];

    Meteor.call('search_keyword', input).forEach(function(item) {
      var project = _project.findOne({ query: '/search?f=' + item + ' added:90d' }, {
        fields: {
          _id: 1,
        },
      });
      var project_id;

      if (project) {
        project_id = project._id;
      } else {
        project_id = _project.insert({
          index: _project.find({}, { fields: { _id: 1 } }).count() + 1,
          query: '/search?f=' + item + ' added:90d',
          title: item,
          worker: 'search',
        });
      }

      search.push(project_id);

      _worker.upsert({
        input: project_id,
        status: '',
        type: 'search',
      }, {
        $set: {
          input: project_id,
          time: moment().toDate(),
          status: '',
          type: 'search',
        },
      });
    });

    return search;
  },

});
