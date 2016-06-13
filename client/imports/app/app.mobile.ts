import { Component } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';

@Component({
  templateUrl: '/client/imports/app/app.mobile.html'
})
class Socially {
  constructor(app: App, platform: Platform, menu: MenuController) {}
}

export function run(): void {
  console.log('Mobile version is not yet available!');
}
