// angular2-meteor polyfills required for testing
import 'angular2-meteor-tests-polyfills';

// Angular 2 tests imports
import { platformBrowserDynamicTesting, BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic';
import { TestBed } from '@angular/core';

// Init the test framework
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
