Picker.route('/redirect', function(p, req, res, next) {
  if (p.query.url) {
    res.end('<html><body><form action="http://qc.4everproxy.com/request" id="form" method="post"><input name="u" type="hidden" value="' + decodeURIComponent(p.query.url) + '"></form><script>document.querySelector("#form").submit();</script></body></html>');
  } else {
    res.end('<html><head><script>window.location.href="' + Meteor.absoluteUrl() + '"</script></head><body></body></html>');
  }
});
