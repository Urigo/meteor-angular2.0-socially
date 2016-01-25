import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { Parties }   from '../collections/parties';
import { Mongo }     from 'meteor/mongo';
import { PartiesForm } from './imports/parties-form/parties-form';

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [PartiesForm]
})
class Socially {
  parties: Mongo.Cursor<Object>;

  constructor () {
    this.parties = Parties.find();
  }
}

bootstrap(Socially);