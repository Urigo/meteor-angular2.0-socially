import { Component }   from '@angular/core';
import { Parties }     from '../../../collections/parties';
import { PartiesForm } from '../parties-form/parties-form';
import { Mongo }       from 'meteor/mongo';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';

import template from './parties-list.html';

@Component({
  selector: 'parties-list',
  template,
  directives: [PartiesForm, ROUTER_DIRECTIVES, LoginButtons]
})
export class PartiesList extends MeteorComponent{
  parties: Mongo.Cursor<Party>;
  pageSize: number = 10;
  curPage: number = 1;
  nameOrder: number = 1;

  constructor() {
    super();

    let options = {
      limit: this.pageSize,
      skip: (this.curPage - 1) * this.pageSize,
      sort: { name: this.nameOrder }
    };

    this.subscribe('parties', options, () => {
      this.parties = Parties.find();
    }, true);
  }

  removeParty(party) {
    Parties.remove(party._id);
  }

  search(value: string) {
    if (value) {
      this.parties = Parties.find({ location: value });
    } else {
      this.parties = Parties.find();
    }
  }
}
