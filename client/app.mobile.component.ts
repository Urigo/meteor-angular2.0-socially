import { Component } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';

import template from './app.mobile.component.html';

@Component({
  template
})
export class AppComponent {
  constructor(app: App, platform: Platform, menu: MenuController) {}
}
