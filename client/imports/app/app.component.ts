import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/models/party.model';

import template from './app.component.html';

@Component({
  selector: 'app',
  template
})
export class AppComponent {
  parties: Observable<Party[]>;

  constructor() {
    this.parties = Parties.find({}).zone();
  }
}
