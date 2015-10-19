/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor, bootstrap} from 'angular2/angular2';

import {Parties} from 'collections/parties';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/app.html',
    directives: [NgFor]
})
class Socially {
    parties: Array<Object>;

    constructor () {
        this.parties = Parties.find().fetch();
    }
}

bootstrap(Socially);
