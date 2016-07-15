import {MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES} from 'ng2-material';
import {MdToolbar} from '@angular2-material/toolbar';
import {MeteorComponent} from 'angular2-meteor';

import { Component, provide } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { PartiesList } from './../parties-list/parties-list.web';
import { PartyDetails } from './../party-details/party-details.ts';
import '../../../collections/methods.ts';
import {GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';
import {LoginButtons} from 'angular2-meteor-accounts-ui';
import '../../../node_modules/@angular2-material/toolbar/toolbar.css';
import { DisplayName } from './../pipes/pipes';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Login } from './../auth/login.web';
import { Signup } from './../auth/signup';
import { Recover } from './../auth/recover';
import { Meteor } from 'meteor/meteor';

import template from './app.web.html';

@Component({
  selector: 'app',
  template: template,
  directives: [ROUTER_DIRECTIVES, LoginButtons, MATERIAL_DIRECTIVES, MdToolbar],
  pipes: [DisplayName]
})
@InjectUser()
class Socially extends MeteorComponent {
  user: Meteor.User;

  constructor() {
    super();
  }

  logout() {
    this.autorun(() => {
      Meteor.logout();
    });
  }
}

const routes: RouterConfig = [
  { path: '',              	component: PartiesList },
  { path: 'party/:partyId',	component: PartyDetails },
  { path: 'login', 		component: Login },
  { path: 'signup', 		component: Signup },
  { path: 'recover', 		component: Recover }
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

export function run(): void {
  bootstrap(Socially, [MATERIAL_PROVIDERS, APP_ROUTER_PROVIDERS, GOOGLE_MAPS_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
}
