import { Component } from '@angular/core';
import { ionicBootstrap, App, Platform, MenuController } from 'ionic-angular';
import { METEOR_PROVIDERS } from 'angular2-meteor';

@Component({
  templateUrl: '/client/imports/app/app.mobile.html'
})
class Socially {
  constructor(app: App, platform: Platform, menu: MenuController) {}
}

export function run(): void {
  ionicBootstrap(Socially, [
    METEOR_PROVIDERS
  ]);
}
