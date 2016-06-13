import { Component } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController } from 'ionic-angular';
import { METEOR_PROVIDERS } from 'angular2-meteor';

import template from './app.mobile.html';

@Component({
  template
})
class Socially {
  constructor(app: App, platform: Platform, menu: MenuController) {}
}

export function run(): void {
  ionicBootstrap(Socially, [
    METEOR_PROVIDERS
  ]);
}
