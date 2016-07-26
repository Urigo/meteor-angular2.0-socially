import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';

import { Parties }   from '../../../both/collections/parties.collection';
import { PartiesFormComponent } from './parties-form.component';

import template from './parties-list.component.html';

@Component({
  selector: 'parties-list',
  template,
  directives: [PartiesFormComponent, ROUTER_DIRECTIVES]
})
export class PartiesListComponent implements OnInit {
  parties: Mongo.Cursor<any>;

  ngOnInit() {
    this.parties = Parties.find();
  }

  removeParty(party) {
    Parties.remove(party._id);
  }
}
