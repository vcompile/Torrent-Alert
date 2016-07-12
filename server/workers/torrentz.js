var store = {
  search: {
    ping: 1,
    queue: [],
  },
  schedule: {
    ping: 1,
    queue: [],
  },
  torrent: {
    ping: 1,
    queue: [],
  },
};

_torrentz_worker = function(row) {
  switch (row.type) {
    case 'schedule':
    case 'torrent':
      if (!_.find(store[row.type].queue, function(item) {
          return (row._id == item._id);
        })) {
        if (!_worker.findOne({
            input: row.input,
            status: {
              $in: ['200'],
            },
            update_time: {
              $gt: moment().subtract(6, 'hours').toDate(),
            },
          }, {
            fields: {
              _id: 1,
            },
          })) {
          row.insert_time = moment(row.insert_time).format('X');

          store[row.type].queue.push(row);
          store[row.type].queue = _.sortBy(store[row.type].queue, 'insert_time');
        } else {
          _worker.update({
            _id: row._id,
          }, {
            $set: {
              status: '402',
              update_time: moment().toDate(),
            },
          });
        }
      } else {
        _worker.update({
          _id: row._id,
        }, {
          $set: {
            status: '400',
            update_time: moment().toDate(),
          },
        });
      }
      break;

    case 'search':
      if (!_.find(store[row.type].queue, function(item) {
          return (row._id == item._id);
        })) {
        row.insert_time = moment(row.insert_time).format('X');

        store[row.type].queue.push(row);
        store[row.type].queue = _.sortBy(store[row.type].queue, 'insert_time');
      } else {
        _worker.update({
          _id: row._id,
        }, {
          $set: {
            status: '400',
            update_time: moment().toDate(),
          },
        });
      }
      break;

      // default:
      //   break;
  }

  if (store[row.type].ping++ <= 1) {
    while (store[row.type].queue.length) {
      var worker = store[row.type].queue.pop();

      switch (worker.type) {
        case 'schedule':
        case 'search':
          var project = _project.findOne({
            _id: worker.input,
          });

          if (project) {
            var res = Meteor.call('query', project.query);

            if (res.count) {
              _project.update({
                _id: project._id,
              }, {
                $set: {
                  count: res.count,
                },
              });

              if (res.torrent && res.torrent.length) {
                res.torrent.forEach(function(item, index) {
                  _torrent.upsert({
                    query: item.query,
                  }, {
                    $addToSet: {
                      project: project._id,
                    },
                    $set: item,
                  });

                  res.torrent[index]._id = _torrent.findOne({
                    query: item.query,
                  })._id;

                  _worker.upsert({
                    input: res.torrent[index]._id,
                    status: '',
                    type: 'torrent',
                  }, {
                    $set: {
                      input: res.torrent[index]._id,
                      insert_time: moment().toDate(),
                      status: '',
                      type: 'torrent',
                    },
                  });
                });

                _worker.update({
                  _id: worker._id,
                }, {
                  $set: {
                    status: '200',
                    update_time: moment().toDate(),
                  },
                });

                if (project.user && worker.type == 'schedule') {
                  project.user.forEach(function(user) {
                    var torrent = _.map(_torrent.find({
                      project: project._id,
                      user_recieved: {
                        $ne: user,
                      },
                      user_removed: {
                        $ne: user,
                      },
                    }, {
                      fields: {
                        _id: 1,
                      },
                    }).fetch(), function(v) {
                      return v._id;
                    });

                    if (torrent.length) {
                      Push.send({
                        from: "torrent.scheduler",
                        notId: project.index,
                        payload: {
                          torrent: torrent,
                          project: project._id,
                        },
                        query: {
                          userId: user,
                        },
                        text: torrent.length + ' item',
                        title: project.title,
                      });
                    }
                  });
                }
              }
            } else {
              _worker.update({
                _id: worker._id,
              }, {
                $set: {
                  status: '404',
                  update_time: moment().toDate(),
                },
              });
            }
          }
          break;

        case 'torrent':
          var torrent = _torrent.findOne({
            _id: worker.input,
          }, {
            fields: {
              query: 1,
            },
          });

          if (torrent) {
            var res = Meteor.call('query', torrent.query);

            if (res.url && res.url.length) {
              _torrent.update({
                _id: torrent._id,
              }, {
                $set: {
                  count: res.url.length,
                },
              });

              res.url.forEach(function(item) {
                _url.upsert({
                  url: item.url,
                }, {
                  $addToSet: {
                    torrent: torrent._id,
                  },
                  $set: item,
                });
              });

              _worker.update({
                _id: worker._id,
              }, {
                $set: {
                  status: '200',
                  update_time: moment().toDate(),
                },
              });
            } else {
              _worker.update({
                _id: worker._id,
              }, {
                $set: {
                  status: '404',
                  update_time: moment().toDate(),
                },
              });
            }
          }
          break;

          // default:
          //   break;
      }
    }

    store[row.type].ping = 1;
  }
};
