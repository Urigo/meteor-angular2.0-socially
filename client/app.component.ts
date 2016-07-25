import { Component } from '@angular/core';
import { Mongo } from 'meteor/mongo';

import { Parties }   from '../both/collections/parties.collection';

import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  parties: Mongo.Cursor<any>;

  constructor() {
    this.parties = Parties.find();
  }
}
