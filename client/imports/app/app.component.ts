import { Component } from '@angular/core';

import template from './app.component.html';
import style from './app.component.scss';
import {InjectUser} from "angular2-meteor-accounts-ui";

@Component({
  selector: 'app',
  template,
  styles: [ style ]
})
@InjectUser('user')
export class AppComponent {
  constructor() {

  }

  logout() {
    Meteor.logout();
  }
}
