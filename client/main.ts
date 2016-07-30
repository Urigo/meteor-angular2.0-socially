import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { GOOGLE_MAPS_PROVIDERS } from 'angular2-google-maps/core';
import { Meteor } from 'meteor/meteor';

import { AppComponent } from './app.web.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';

import '../both/methods/parties.methods';

if (Meteor.isCordova) {
  document.addEventListener('deviceready', () => {
    runMobile();
  });
} else {
  runWeb();
}

function runWeb() {
  bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    APP_ROUTER_PROVIDERS,
    GOOGLE_MAPS_PROVIDERS
  ]);
}

function runMobile() {
  console.log('Mobile version is not yet available!');
}
