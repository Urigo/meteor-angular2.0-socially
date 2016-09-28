import { Component } from '@angular/core';

import template from './app.component.web.html';
import {InjectUser} from "angular2-meteor-accounts-ui";

@Component({
  selector: 'app',
  template
})
@InjectUser('user')
export class AppComponent {
  constructor() {

  }

  logout() {
    Meteor.logout();
  }
}
