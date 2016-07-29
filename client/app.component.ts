import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MdToolbar } from '@angular2-material/toolbar';

import template from './app.component.html';

@Component({
  selector: 'app',
  template,
  directives: [ROUTER_DIRECTIVES, LoginButtons, MdToolbar]
})
export class AppComponent {}
