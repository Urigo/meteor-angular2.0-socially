import { Component } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';

import template from './app.mobile.html';

@Component({
  template
})
class Socially {
  constructor(app: App, platform: Platform, menu: MenuController) {}
}

export function run(): void {
  console.log('Mobile version is not yet available!');
}
