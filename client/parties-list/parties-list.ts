/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {Parties} from 'collections/parties';

import {PartiesForm} from 'client/parties-form/parties-form';

import {RouterLink} from 'angular2/router';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/parties-list/parties-list.html',
    directives: [NgFor, PartiesForm, RouterLink]
})
export class PartiesList {
    parties: Mongo.Cursor<Party>;

    constructor() {
        this.parties = Parties.find();
    }

    removeParty(party) {
        Parties.remove(party._id);
    }
}
