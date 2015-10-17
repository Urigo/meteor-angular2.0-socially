/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {bootstrap} from 'angular2-meteor';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

@Component({
    selector: 'app'
})
@View({
    directives: [ROUTER_DIRECTIVES]
})
class Socially {}

bootstrap(Socially, [ROUTER_PROVIDERS]);
