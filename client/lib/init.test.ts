// angular2-meteor polyfills
import 'angular2-meteor-polyfills';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';

// angular2-meteor polyfills required for testing
import 'angular2-meteor-tests-polyfills';

// Angular 2 tests imports
import { TestBed, getTestBed } from '@angular/core/testing';
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

// Init the test framework
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

declare var Mocha: {Hook: any}, mocha: { suite : { _beforeEach: any, ctx: any }};

const hook = new Mocha.Hook("Modified Angular beforeEach Hook", () => {
  getTestBed().resetTestingModule();
});

hook.ctx = mocha.suite.ctx;
hook.parent = mocha.suite;
mocha.suite._beforeEach = [hook];