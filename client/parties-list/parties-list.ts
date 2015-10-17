/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View, NgFor} from 'angular2/angular2';

import {Parties} from 'collections/parties';

import {PartiesForm} from 'client/parties-form/parties-form';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/parties-list/parties-list.html',
    directives: [NgFor, PartiesForm]
})
export class PartiesList {
    parties: Mongo.Cursor<Object>;

    constructor() {
        this.parties = Parties.find();
    }

    removeParty(party) {
        Parties.remove(party._id);
    }
}
