import { Component } from '@angular/core';
import { Mongo } from 'meteor/mongo';

import { Parties }   from '../both/collections/parties.collection';
import { PartiesFormComponent } from './imports/parties/parties-form.component';

import template from './app.component.html';

@Component({
  selector: 'app',
  template,
  directives: [PartiesFormComponent]
})
export class AppComponent {
  parties: Mongo.Cursor<any>;

  constructor() {
    this.parties = Parties.find();
  }

  removeParty(party) {
    Parties.remove(party._id);
  }
}
