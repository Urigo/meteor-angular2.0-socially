import 'reflect-metadata';
import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES} from 'ng2-material';

import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { PartiesList } from './imports/parties-list/parties-list.ts';
import { PartyDetails } from './imports/party-details/party-details.ts';
import '../collections/methods.ts';
import {GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';
import {LoginButtons} from 'angular2-meteor-accounts-ui';

import template from './app.html';

@Component({
  selector: 'app',
  template,
  directives: [ROUTER_DIRECTIVES, LoginButtons, MATERIAL_DIRECTIVES]
})
class Socially {}

const routes: RouterConfig = [
  { path: '',              	component: PartiesList },
  { path: 'party/:partyId',	component: PartyDetails },
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

bootstrap(Socially, [MATERIAL_PROVIDERS, APP_ROUTER_PROVIDERS, GOOGLE_MAPS_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
