import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LoginButtons, InjectUser } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';
import { MdToolbar } from '@angular2-material/toolbar';
import { Meteor } from 'meteor/meteor';

import { DisplayNamePipe } from './imports/shared/display-name.pipe';

import template from './app.web.component.html';

@Component({
  selector: 'app',
  template,
  directives: [ROUTER_DIRECTIVES, LoginButtons, MdToolbar],
  pipes: [DisplayNamePipe]
})
@InjectUser('user')
export class AppComponent extends MeteorComponent {
  user: Meteor.User;

  constructor() {
    super();
  }

  logout() {
    Meteor.logout();
  }
}
