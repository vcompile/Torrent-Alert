Package.describe({
    documentation: null,
    git: "https://github.com/meteorwebcomponents/layout.git",
    name: "mwc:layout",
    summary: "mwc layout",
    version: "1.1.7"
});

Package.onUse(function(api) {
    api.versionsFrom("1.0");

    api.addAssets("mwc_layout.html", ["client"]);
    api.addFiles("PolymerLayout.js", ["client"]);

    api.export("mwcLayout");
});
