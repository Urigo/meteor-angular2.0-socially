import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import template from './app.component.html';

@Component({
  selector: 'app',
  template,
  directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {}
