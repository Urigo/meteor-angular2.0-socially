[{]: <region> (header)
# Step 8: Folder structure
[}]: #
[{]: <region> (body)
In this step we will:

- review the file structure of our Socially app so far,
- look closer into certain TypeScript features, since having a better understanding of the primary programming language of this package would be surely beneficial

# File Structure

As you have probably noticed, our tutorial app has a strict modular structure at this point:
there are no pure JavaScript files that are being bundled together and auto-executed, so Meteor's file loading conventions doesn't have any effect.
Even more, every `.ts` file is being compiled into a separate CommonJS module, which we can then import whenever we need to.

There is another thing worth mentioning once more. As you know, Meteor has two special folders: _client_ and _server_.
We can benefit from them (and have already done so in this app) by allowing access to the client side modules from the client side only and, accordingly, to server side modules from the server side.
Everything outside of those folders will be available to the both client and server.
It’s no wonder why this is a recommended approach in Meteor, and this is why we’ve been doing it so far.
Let's stick to it further.

# TypeScript

TypeScript is a rather new language that has been growing in [popularity](https://www.google.com/trends/explore#q=%2Fm%2F0n50hxv) since it's creation 3 years ago. TypeScript has one of the fullest implementations of ES2015 features on the market: including some experimental features, pseudo type-checking and a rich toolset developed by Microsoft and the TypeScript community. It has support already in all major IDEs including Visual Studio, WebStorm, Sublime, Atom, etc.

One of the biggest issues in JavaScript is making code less bug-prone and more suitable for big projects. In the OOP world, well-known solutions include modularity and strict type-checking. While OOP is available in JavaScript in some way, it turned out to be very hard to create good type-checking. One always needs to impose a certain number of rules to follow to make a JavaScript compiler more effective. For many years, we’ve seen around a number of solutions including the Closure Compiler and GWT from Google, a bunch of C#-to-JavaScript compilers and others.

This was, for sure, one of the problems the TypeScript team were striving to solve: to create a language that would inherit the flexibility of JavaScript while, at the same time, having effective and optional type-checking with minimum effort required from the user.

## Interfaces

We are already declared a `Party` interface, and you should already be familiar with its properties: "name", "description" and "location". We can make the "Description" property optional.

TypeScript's type-checking bases on the "shapes" that types have. And interfaces are TypeScript's means to describe these type "shapes", which is sometimes called "duck typing". More on that you can read [here](http://www.typescriptlang.org/docs/handbook/interfaces.html).

## TypeScript Configuration and IDEs

As you already know from the bootstrapping step, TypeScript is generally configured by a special JSON file called [_tsconfig.json_](https://github.com/Microsoft/typescript/wiki/tsconfig.json).

As mentioned, the TypeScript language today has development plugins in many [popular IDEs](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support), including Visual Studio, WebStorm, Sublime, Atom etc. These plugins work in the same style as it's become de facto today — compile, using TypeScript shell command, `.ts` and `tsconfig.json` files update automatically as you change them.
With that, if you've configured your project right with declaration files in place you'll get a bunch of invaluable features such as better code completion and instantaneous highlighting of compilation errors.

If you use one of the mentioned IDEs, you've likely noticed that a bunch of the code lines
are now marked in red, indicating the TypeScript plugins don't work right quite yet.

That's because most of the plugins recognize _tsconfig.json_ as well if it's placed in the root folder,
but so far our _tsconfig.json_ contains only a "files" property, which is certainly not enough for
a general compilation. At the same time, Angular2-Meteor's TypeScript compiler, defaults most of the
compilation options internally to fit our needs. To fix plugins, let's set up our _tsconfig.json_
properly with the options that will make plugins understand our needs and the structure of our app.

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "isolatedModules": false,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "removeComments": false,
    "noImplicitAny": false,
    "sourceMap": true
  },
  "exclude": [
    "node_modules"
  ],
  "compileOnSave": false
}
```

**CompilerOptions:**

- `target` - Specify ECMAScript target version
- `module` - Specify module code generation
- `isolatedModules` - Unconditionally emit imports for unresolved files
- `moduleResolution` - Determine how modules get resolved
- `experimentalDecorators` - Enables experimental support for ES7 decorators.
- `emitDecoratorMetadata` - Emit design-type metadata for decorated declarations in source
- `removeComments` - Remove all comments except copy-right header comments beginning with
- `noImplicitAny` - Raise error on expressions and declarations with an implied 'any' type
- `sourceMap` - Generates corresponding '.map' file

Now, let's go to any of the `.ts` files and check if all that annoying redness has disappeared.

> Note: you may need to reload you IDE to pick up the latest changes to the config.

Please note, since the Meteor environment is quite specific, some of the `tsconfig.json` options won't make sense in Meteor. You can read about the exceptions [here](https://github.com/barbatus/typescript#compiler-options).
TypeScript compiler of this package supports some additional options that might be useful in the Meteor environment.
They can be included in the "meteorCompilerOptions" section of _tsconfig.json_ and described [here](https://github.com/barbatus/ts-compilers#typescript-config).

### IDE Specific Configurations

##### Atom

If you are using [Atom](atom.io) as your editor with the [Atom-TypeScript plugin](https://github.com/TypeStrong/atom-typescript), use the following configuration to automatically generate your `tsconfig.json` file:

    {
     "atom": {
        "rewriteTsconfig": true
      },
      "compileOnSave": false,
      "buildOnSave": false,
      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "classic",
        "experimentalDecorators": true
      },
      "filesGlob": [
        "**/*.ts"
      ],
      "files": []
    }

# Summary

In this step we discovered how to make our TypeScript code less buggy with:

- the benefits of type-checking
- type declaration files for verifying library APIs
- interfaces to check our own projects APIs
- TSD for loading declaration files easily
- creating a `tsconfig.json` file for loading files and specifying compiler options

In the [next step](/tutorials/angular2/user-accounts-authentication-and-permissions) we'll look at creating user accounts and securing server data access.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step7.md) | [Next Step >](step9.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #