import { Component } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';

import { PartiesListComponent } from './imports/parties/parties-list.mobile.component';

import template from './app.mobile.component.html';

@Component({
  template
})
export class AppComponent {
  rootPage: any;

  constructor(app: App, platform: Platform, menu: MenuController) {
    this.rootPage = PartiesListComponent;
  }
}
