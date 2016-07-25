// angular2-meteor polyfills required for testing
import 'angular2-meteor-tests-polyfills';

// Angular 2 tests imports
import {
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS,
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';
import { setBaseTestProviders } from '@angular/core/testing';

// Init the test framework
setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);
