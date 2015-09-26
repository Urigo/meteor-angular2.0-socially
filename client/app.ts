/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor, bootstrap} from 'angular2/angular2';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/app.html',
    directives: [NgFor]
})
class Socially { }

bootstrap(Socially);
