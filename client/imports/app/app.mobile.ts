import { Component } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController } from 'ionic-angular';
import { METEOR_PROVIDERS } from 'angular2-meteor';

import { PartiesList } from '../parties-list/parties-list.mobile';

@Component({
  templateUrl: '/client/imports/app/app.mobile.html'
})
class Socially {
  rootPage: any;
  constructor(app: App, platform: Platform, menu: MenuController) {
    this.rootPage = PartiesList;
  }
}

export function run(): void {
  ionicBootstrap(Socially, [
    METEOR_PROVIDERS
  ]);
}
