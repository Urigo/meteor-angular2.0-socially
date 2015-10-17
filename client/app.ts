/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {Parties} from 'collections/parties';

import {bootstrap} from 'angular2-meteor';

import {PartiesForm} from 'client/parties-form/parties-form';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/app.html',
    directives: [NgFor, PartiesForm, ROUTER_DIRECTIVES]
})
class Socially {
    parties: Mongo.Cursor<Object>;

    constructor () {
        this.parties = Parties.find();
    }

    removeParty(party) {
        Parties.remove(party._id);
    }
}

bootstrap(Socially, [ROUTER_PROVIDERS]);
