import { Component }   from '@angular/core';
import { Parties }     from '../../../collections/parties';
import { PartiesForm } from '../parties-form/parties-form';
import { Mongo }       from 'meteor/mongo';
import { RouterLink }  from '@angular/router-deprecated';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';

@Component({
  selector: 'parties-list',
  templateUrl: '/client/imports/parties-list/parties-list.html',
  directives: [PartiesForm, RouterLink, LoginButtons]
})
export class PartiesList extends MeteorComponent{
  parties: Mongo.Cursor<Party>;

  constructor() {
    super();
    this.subscribe('parties', () => {
      this.parties = Parties.find();
    }, true);
  }

  removeParty(party) {
    Parties.remove(party._id);
  }
}