// This version should match the version that es6-module-loader has as dependency
// to avoid problems.
var traceurVersion = '0.0.89';

Package.describe({
  summary: 'Let you use ES6 now.',
  version: '0.1.1'
});

Npm.depends({
  'traceur': traceurVersion,
  'es6-module-loader': '0.16.5',
  'systemjs': '0.14.1'
});

Package._transitional_registerBuildPlugin({
  name: 'systemjs',
  use: [],
  sources: [
    'plugin/compiler.js'
  ],
  npmDependencies: {
    'traceur': traceurVersion
  }
});

Package.on_use(function (api) {
  // Server
  api.add_files('traceur.js', 'server');
  api.add_files('systemjs.js', 'server');
  api.add_files('rtts-assert/assert.js', 'server');
  api.export(['$traceurRuntime', 'System', 'Loader', 'Module', 'assert'], 'server');

  // Client
  api.add_files('.npm/package/node_modules/traceur/bin/traceur-runtime.js', 'client');
  api.add_files('rtts-assert/assert.js', 'client');
  api.add_files('.npm/package/node_modules/es6-module-loader/dist/es6-module-loader.js', 'client');
  api.add_files('.npm/package/node_modules/systemjs/dist/system.js', 'client');
  api.export('assert', 'client')

  api.add_files('zone.js', 'client');
  //api.export('Zone', 'client');
});
