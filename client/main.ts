import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { GOOGLE_MAPS_PROVIDERS } from 'angular2-google-maps/core';
import { ionicBootstrap } from 'ionic-angular';
import { METEOR_PROVIDERS } from 'angular2-meteor';
import { Meteor } from 'meteor/meteor';

import { AppComponent as AppWebComponent } from './app.web.component';
import { AppComponent as AppMobileComponent } from './app.mobile.component';
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
  bootstrap(AppWebComponent, [
    disableDeprecatedForms(),
    provideForms(),
    APP_ROUTER_PROVIDERS,
    GOOGLE_MAPS_PROVIDERS
  ]);
}

function runMobile() {
  ionicBootstrap(AppMobileComponent, [
    METEOR_PROVIDERS
  ]);
}
