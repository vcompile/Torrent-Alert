var fs = Npm.require('fs');
var path = Npm.require('path');
var _ = Npm.require('underscore');
Package.describe({
  documentation: 'README.md',
  git: "https://github.com/meteorwebcomponents/compiler.git",
  name: "mwc-compiler",
  summary: "Use polymer as the default templating engine instead of blaze.",
  version: "1.0.5"
});

function deps(api) {


  var d = ["underscore", "mwc:compiler", "mwc:extensions"];
  var mwcFilePath = path.resolve('client/compiler.mwc.json');
  if (fs.existsSync(mwcFilePath)) {
    try {
      var mwcFile = JSON.parse(fs.readFileSync(mwcFilePath, 'utf8'));
    } catch (err) {
      return d;
    }
    if (mwcFile.hasOwnProperty("extensions")) {
      var extensions = _.keys(_.omit(mwcFile.extensions, ["log", "logFile"]));
      extensions.forEach(function(ext) {
        d.push(ext);
      });

    }
  }
  return d;
}
Package.on_use(function(api) {
  api.use("underscore", "server");
  api.use("isobuild:compiler-plugin@1.0.0");
  api.versionsFrom("1.0");
});

Npm.depends({
  "mkdirp": "0.5.1",
  'node-echo': '0.1.1'
});

Package.registerBuildPlugin({
  name: 'compile-ext',
  use: deps(),
  sources: ['compiler.js'],
  npmDependencies: {
    "chokidar": "1.2.0"
  }
});