# meteor-es6

Allows you to use ES6 in Meteor today. This bundle uses:

* [Traceur](https://github.com/google/traceur-compiler)
* [SystemJS](https://github.com/systemjs/systemjs)
* [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader)

[Supported ES6 Features](https://github.com/google/traceur-compiler/wiki/LanguageFeatures).
Additionally you can use Types and Annotations. Type assertions are activated while developing.
They are deactivated when you bundle.

The Javascript files that include ES6 must end with `.next.js`.
You must use the ES6 Module System. Add a loading script `run.js` to your root,
that will load the main script (main.next.js in this example):

```javascript
System.config({
  paths: {
    // Add you path rules here
  }
});

System.import('./main')
  .then(function (main) {
    console.log('Loaded main');
  })
  .catch(function (error) {
    console.log('Failed loading main');
    console.log(error);
  });
```

More info in the [SystemJS README](https://github.com/systemjs/systemjs).

A example project will come soon.
