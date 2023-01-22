(function(back) {
  var FILE = "cassiopeiaWatch.settings.json";
  var settings = Object.assign({
    foo: 42,
  }, require('Storage').readJSON(FILE, true) || {});

  function writeSettings() {
    require('Storage').writeJSON(FILE, settings);
  }


  E.showMenu({
    "": { "title": "Cassiopeia Watch" },
    "< Back": () => back(),
    'Foo': {
      value: 0 | settings.foo,
      min: 0,
      max: 100,
      onchange: v => {
        settings.foo = v;
        writeSettings();
      }
    },
  });
})