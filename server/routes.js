console.log('process.env.ACCESS_KEY', process.env.ACCESS_KEY);

Picker.route('/proxy/:key', function(p, req, res, next) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
  });

  if (p.key == process.env.ACCESS_KEY) {
    if (p.query.torrentz_proxy) {
      _torrentz_proxy = p.query.torrentz_proxy.split(/\|/).filter(Boolean);
    }

    if (p.query.proxy) {
      _proxy = p.query.proxy.split(/\|/).filter(Boolean);
    }
  }

  res.end(JSON.stringify({
    torrentz_proxy: _torrentz_proxy,
    proxy: _proxy,
  }));
});

Picker.route('/redirect', function(p, req, res, next) {
  if (p.query.url) {
    res.end('<html><head><title>Torrent Alert</title><link href="/png/icon.png" rel="shortcut icon"></head><body><form action="https://1.hidemyass.com/includes/process.php?action=update" id="form" method="post"><input name="u" type="hidden" value="' + p.query.url +
      '"></form><script>document.querySelector("#form").submit();</script></body></html>');
  } else {
    res.end('<html><head><title>redirecting</title><script>window.location.href="' + Meteor.absoluteUrl() + '"</script></head><body></body></html>');
  }
});
