if (!_project.findOne({
    _id: "trending",
  }, {
    fields: {
      _id: 1,
    },
  })) {
  _project.insert({
    _id: 'trending',
    index: 1,
    query: '/verifiedP?f= added<7d',
    title: "Trending this week",
    worker: 'schedule',
  });

  _worker.upsert({
    input: 'trending',
    status: '',
    type: 'schedule',
  }, {
    $set: {
      input: 'trending',
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
    query: '/search?f=movie',
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
