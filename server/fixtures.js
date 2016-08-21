if (!_project.findOne({
    _id: 'latest_movies',
  }, {
    fields: {
      _id: 1,
    },
  })) {
  _project.insert({
    _id: 'latest_movies',
    index: 3,
    query: '/search?f=movies',
    title: 'Latest movies',
    worker: 'schedule',
  });

  _worker.upsert({
    input: 'latest_movies',
    status: '',
    type: 'schedule',
  }, {
    $set: {
      input: 'latest_movies',
      insert_time: moment().toDate(),
      status: '',
      type: 'schedule',
    },
  });
}

if (!_project.findOne({
    _id: 'latest_softwares',
  }, {
    fields: {
      _id: 1,
    },
  })) {
  _project.insert({
    _id: 'latest_softwares',
    index: 2,
    query: '/search?f=software',
    title: 'Latest softwares',
    worker: 'schedule',
  });

  _worker.upsert({
    input: 'latest_softwares',
    status: '',
    type: 'schedule',
  }, {
    $set: {
      input: 'latest_softwares',
      insert_time: moment().toDate(),
      status: '',
      type: 'schedule',
    },
  });
}
