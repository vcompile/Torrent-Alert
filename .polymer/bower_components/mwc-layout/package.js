Package.describe({
  documentation: "README.md",
  git: "https://github.com/meteorwebcomponents/layout.git",
  name: "mwc:layout",
  summary: "Polymer Layout renderer",
  version: "1.1.11"
});

Package.onUse(function(api) {
  api.versionsFrom("1.3");
  api.use('ecmascript');
  api.use('mwc:synthesis@1.0.16');

  api.addFiles("PolymerLayout.js", ["client"]);
  api.addFiles("mwc_layout.js", ["client"]);
  api.addAssets("mwc_layout.html", ["client"]);

  api.export("mwcLayout",["client"]);
});
