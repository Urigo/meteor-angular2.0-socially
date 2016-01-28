import { Component }   from '@angular/core';
import { Parties }     from '../../../collections/parties';
import { PartiesForm } from '../parties-form/parties-form';
import { Mongo }       from 'meteor/mongo';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { LoginButtons } from 'angular2-meteor-accounts-ui';

import template from './parties-list.html';

@Component({
  selector: 'parties-list',
  template,
  directives: [PartiesForm, ROUTER_DIRECTIVES, LoginButtons]
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
