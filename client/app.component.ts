import { Component } from '@angular/core';

import { DemoComponent } from './imports/demo/demo.component';

import template from './app.component.html';

@Component({
  selector: 'app',
  template,
  directives: [DemoComponent]
})
export class AppComponent {
  constructor() {
  }
}
