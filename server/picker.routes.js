Picker.route('/proxy', (p, req, res, next) => {
  res.end(p.query.url ? '<html><body><form action="http://qc.4everproxy.com/request" id="form" method="post"><input name="u" type="hidden" value="' + decodeURIComponent(p.query.url) + '"></form><script>document.querySelector("#form").submit();</script></body></html>' : '<html><head><script>window.location.href="' + Meteor.absoluteUrl() + '"</script></head></html>');
});
