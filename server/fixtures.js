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
    title: 'App Collection',
    worker: 'schedule',
  });

  _worker.upsert({
    input: 'latest_softwares',
    status: '',
    type: 'schedule',
  }, {
    $set: {
      input: 'latest_softwares',
      status: '',
      time: moment().toDate(),
      type: 'schedule',
    },
  });
}
