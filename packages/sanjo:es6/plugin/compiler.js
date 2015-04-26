var traceur = Npm.require('traceur');
var os = Npm.require('os');

Plugin.registerSourceHandler("next.js", function (compileStep) {
  var oldPath = compileStep.inputPath;
  var newPath = oldPath.replace(/\.next\.js$/, '.js');
  var moduleName = oldPath.replace(/\.next\.js$/, '');

  moduleName = 'app';
  var content = compileStep.read().toString('utf8');
  var traceurOptions = {
    filename: oldPath,
    sourceMap: true,
    modules: 'instantiate',
    moduleName: moduleName,
    types: true,
    typeAssertions: true,
    annotations: true,
    memberVariables: true,
    typeAssertionModule: 'rtts_assert/rtts_assert'
  };
  var output = traceur.compile(content, traceurOptions);

  newPath = 'client/app.js';

  console.log('path', newPath);
  console.log('old path', oldPath);
  console.log('module name', moduleName);
  /*
  if (output.errors.length) {
    throw new Error(output.errors.join(os.EOL));
  }
  */

  compileStep.addJavaScript({
    sourcePath: oldPath,
    path: newPath,
    data: output,
    sourceMap: output.sourceMap
  });
});
