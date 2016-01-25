import 'reflect-metadata';
import { Component } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';

import template from './app.html';

@Component({
  selector: 'app',
  template,
  directives: [ROUTER_DIRECTIVES]
})
class Socially {}

bootstrap(Socially);
