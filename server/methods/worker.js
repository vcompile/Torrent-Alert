const moment = require('moment');

Meteor.methods({

  update_worker(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    if (user._id != 'ADMIN') throw new Meteor.Error(422, "userNotAllowed");

    switch (input.type) {

      case 'keyword':
        input.project = [];

        if (input.keyword) {
          input.keyword.forEach((keyword) => {
            keyword = keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();

            if (keyword) {
              let query = '/search?f=' + keyword + ' seed > 0 added:999d';

              let project = _project.findOne({
                query: query,
              }, {
                fields: {
                  _id: true,
                },
              });

              if (project) {
                input.project.push(project._id);

                // let worker = _worker.findOne({
                //   query: query,
                // }, {
                //   fields: {
                //     status: true,
                //     time: true,
                //   },
                // });

                // if (worker) {
                //   if (worker.status != '200' || 3 < moment.duration(moment().diff(worker.time)).asDays()) {
                //     _worker.update({
                //       _id: worker._id,
                //     }, {
                //       $set: {
                //         status: '',
                //         time: moment().toDate(),
                //       },
                //     });
                //   }
                // } else {
                //   _worker.insert({
                //     query: query,
                //     status: '',
                //     time: moment().toDate(),
                //     type: 'project',
                //   });
                // }
              } else {
                input.project.push(_project.insert({ query: query, title: keyword, error: '' }));

                // _worker.insert({
                //   query: query,
                //   status: '',
                //   time: moment().toDate(),
                //   type: 'project',
                // });
              }
            }
          });
        }

        _worker.update({
          _id: input._id,
        }, {
          $set: {
            project: input.project,
            status: (input.error ? input.error : '200'),
            time: moment().toDate(),
          },
        });
        break;

      case 'project':
        let project = _project.findOne({
          query: input.query,
        }, {
          fields: {
            _id: true,
          },
        });

        if (project) {
          if (input.recent) {
            input.project = [];

            input.recent.forEach((keyword) => {
              keyword = keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();

              if (keyword) {
                let query = '/search?f=' + keyword + ' seed > 0 added:999d';

                let project = _project.findOne({
                  query: query,
                }, {
                  fields: {
                    _id: true,
                  },
                });

                if (project) {
                  input.project.push(project._id);
                } else {
                  input.project.push(_project.insert({ query: query, title: keyword, error: '' }));
                }
              }
            });

            let worker = _worker.findOne({
              _id: '_recent_',
            }, {
              fields: {
                time: true,
              },
            });

            if (worker) {
              if (3 < moment.duration(moment().diff(worker.time)).asMinutes()) {
                _worker.update({
                  _id: worker._id,
                }, {
                  $set: {
                    project: input.project,
                    time: moment().toDate(),
                  },
                });
              }
            } else {
              _worker.insert({
                _id: '_recent_',
                project: input.project,
                status: '200',
                time: moment().toDate(),
              });
            }
          }

          if (input.torrent) {
            input.torrent.forEach((torrent) => {
              let exists = _torrent.findOne({
                query: torrent.query,
              }, {
                fields: {
                  _id: true,
                },
              });

              if (exists) {
                _torrent.update({ _id: exists._id }, { $addToSet: { project: project._id }, $set: torrent });

                let worker = _worker.findOne({
                  query: torrent.query,
                }, {
                  fields: {
                    status: true,
                    time: true,
                  },
                });

                if (worker) {
                  if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
                    _worker.update({
                      _id: worker._id,
                    }, {
                      $set: {
                        status: '',
                        time: moment().toDate(),
                      },
                    });
                  }
                } else {
                  _worker.insert({
                    query: torrent.query,
                    status: '',
                    time: moment().toDate(),
                    type: 'torrent',
                  });
                }
              } else {
                _torrent.insert(_.extend(torrent, { project: [project._id], url: [] }));

                _worker.insert({
                  query: torrent.query,
                  status: '',
                  time: moment().toDate(),
                  type: 'torrent',
                });
              }
            });
          }

          if (input.torrent_count) {
            _project.update({
              _id: project._id,
            }, {
              $set: {
                error: '',
                torrent_count: input.torrent_count,
              },
            });
          } else {
            _project.update({
              _id: project._id,
            }, {
              $set: {
                error: (input.error ? input.error : 'noItemFound'),
              },
            });
          }
        } else {
          throw new Meteor.Error(422, 'projectNotFound - { query: "' + input.query + '" }');
        }

        _worker.update({
          _id: input._id,
        }, {
          $set: {
            status: (input.error ? input.error : '200'),
            time: moment().toDate(),
          },
        });
        break;

      case 'torrent':
        let torrent = _torrent.findOne({
          query: input.query,
        }, {
          fields: {
            _id: true,
          },
        });

        if (torrent) {
          if (input.url) {
            let _torrent_url = [];

            input.url.forEach((url) => {
              let exists = _url.findOne({
                query: url.query,
              }, {
                fields: {
                  _id: true,
                },
              });

              if (exists) {
                _torrent_url.push(exists._id);
              } else {
                _torrent_url.push(_url.insert(url))
              }
            });

            _torrent.update({
              _id: torrent._id,
            }, {
              $set: {
                url: _torrent_url,
              },
            });
          }
        } else {
          throw new Meteor.Error(422, 'torrentNotFound - { query: "' + input.query + '" }');
        }

        _worker.update({
          _id: input._id,
        }, {
          $set: {
            status: (input.error ? input.error : '200'),
            time: moment().toDate(),
          },
        });
        break;

    }
  },

});
