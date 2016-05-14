import 'reflect-metadata';
import { Component } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { Parties }   from '../collections/parties';
import { Mongo }     from 'meteor/mongo';
import { PartiesForm } from './imports/parties-form/parties-form';
import { provideRouter, RouterConfig, ROUTER_DIRECTIVES } from '@angular/router';

import template from './app.html';

@Component({
  selector: 'app',
  template,
  directives: [PartiesForm, ROUTER_DIRECTIVES]
})
class Socially {
  parties: Mongo.Cursor<Object>;

  constructor () {
    this.parties = Parties.find();
  }

  removeParty(party) {
    Parties.remove(party._id);
  }
}

bootstrap(Socially);
