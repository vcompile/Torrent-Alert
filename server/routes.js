Picker.route('/redirect', function(p, req, res, next) {
  if (p.query.url) {
    res.end('<html><body><form action="https://www.filterbypass.me/includes/process.php?action=update" id="form" method="post"><input name="k" type="hidden" value="' + p.query.url +
      '"></form><script>document.querySelector("#form").submit();</script></body></html>');
  } else {
    res.end('<html><head><script>window.location.href="' + Meteor.absoluteUrl() + '"</script></head><body></body></html>');
  }
});
