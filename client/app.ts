import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [ROUTER_DIRECTIVES]
})
class Socially {}

bootstrap(Socially, [ROUTER_PROVIDERS]);
