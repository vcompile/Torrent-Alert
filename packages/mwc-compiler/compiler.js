Plugin.registerCompiler({
  extensions: ["mwc.json"],
  filenames: []
}, function() {
  var compiler = new MWC_Compiler();

  return compiler;
});