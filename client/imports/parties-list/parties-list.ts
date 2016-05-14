import { Component }   from '@angular/core';
import { Parties }     from '../../../collections/parties';
import { PartiesForm } from '../parties-form/parties-form';
import { Mongo }       from 'meteor/mongo';

import template from './parties-list.html';

@Component({
  selector: 'parties-list',
  template,
  directives: [PartiesForm]
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
