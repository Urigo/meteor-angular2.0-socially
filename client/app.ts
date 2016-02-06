import 'reflect-metadata';
import 'zone.js/dist/zone';
import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES} from 'ng2-material';
import {MdToolbar} from '@angular2-material/toolbar';

import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';
import { APP_BASE_HREF } from '@angular/common';
import { PartiesList } from './imports/parties-list/parties-list.ts';
import { PartyDetails } from './imports/party-details/party-details.ts';
import '../collections/methods.ts';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';
import {LoginButtons} from 'angular2-meteor-accounts-ui';
import '../node_modules/@angular2-material/toolbar/toolbar.css'

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [ROUTER_DIRECTIVES, LoginButtons, MATERIAL_DIRECTIVES, MdToolbar]
})
@RouteConfig([
  { path: '/', as: 'PartiesList', component: PartiesList },
  { path: '/party/:partyId', as: 'PartyDetails', component: PartyDetails }
])
class Socially {}

bootstrap(Socially, [MATERIAL_PROVIDERS, ROUTER_PROVIDERS, ANGULAR2_GOOGLE_MAPS_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
