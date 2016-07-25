# Angular2-Meteor-Base Tutorial

## Usage

Since Meteor v1.4 you can use one command to create a working Angular2 app based on this boilerplate:

```
meteor create --example angular2-boilerplate
```

## Boilerplate Contents

This boilerplate contains the basics that requires to quick start with Angular2-Meteor application.

This package contains:

- TypeScript support and Angular 2 compilers for Meteor
- Angular2-Meteor
- Angular2 (core, common, compiler, platform)
- SASS support
- Testing framework with Mocha and Chai

This application also contains demo code:

- Main Component (`/client/app.component`)
- Demo Child Component (`/client/imports/demo/demo.component`)
- Demo Service (`/client/imports/demo/demo-data.service`)
- Demo Mongo Collection (`/both/demo-collection.ts`)

The Main component loads the child component, which uses the demo service that gets it's data from the demo collection.

## Folder Structure

The folder structure is a mix between [Angular 2 recommendation](https://johnpapa.net/angular-2-styles/) and [Meteor 1.3 recommendation](https://guide.meteor.com/structure.html).

#### Client

The `client` folder contains single TypeScript (`.ts`) file which is the main file (`/client/app.component.ts`), and bootstrap's the Angular 2 application.

The main component uses HTML template and SASS file.

The `index.html` file is the main HTML which loads the application by using the main component selector (`<app>`).

All the other client files are under `client/imports` and organized by the context of the components (in our example, the context is `demo`).


#### Server

The `server` folder contain single TypeScript (`.ts`) file which is the main file (`/server/main.ts`), and creates the main server instance, and the starts it.

All other server files should be located under `/server/imports`.

#### Common

Example for common files in our app, is the MongoDB collection we create - it located under `/both/demo-collection.ts` and it can be imported from both client and server code.

## Testing

The testing environment in this boilerplate based on [Meteor recommendation](https://guide.meteor.com/testing.html), and uses Mocha as testing framework along with Chai for assertion.

There is a main test file that initialize Angular 2 tests library, it located under `/client/init.test.ts`.

All other test files are located near the component/service it tests, with the `.test.ts` extension.

The `DemoComponent` contains example for Angular 2 tests for Component, and in the server side there is an example for testing Meteor collections and stub data.
