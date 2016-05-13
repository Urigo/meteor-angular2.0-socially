import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app',
  templateUrl: 'client/app.html'
})
class Socially { }

bootstrap(Socially);