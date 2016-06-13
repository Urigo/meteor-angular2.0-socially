import { Component }   from '@angular/core';
import { RouterLink }  from '@angular/router-deprecated';
import { MATERIAL_DIRECTIVES } from 'ng2-material';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MeteorComponent } from 'angular2-meteor';
import { ANGULAR2_GOOGLE_MAPS_DIRECTIVES } from 'angular2-google-maps/core';
import { PaginationService, PaginatePipe, PaginationControlsCmp } from 'angular2-pagination';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { RsvpPipe, DisplayMainImagePipe } from '../pipes/pipes';
import { Parties }     from '../../../collections/parties';
import { PartiesForm } from '../parties-form/parties-form';
import { PartiesList as PartiesListBase } from './parties-list.class';

@Component({
  selector: 'parties-list',
  viewProviders: [
    PaginationService
  ],
  templateUrl: '/client/imports/parties-list/parties-list.web.html',
  directives: [
    MATERIAL_DIRECTIVES,
    ANGULAR2_GOOGLE_MAPS_DIRECTIVES,
    PartiesForm,
    RouterLink,
    PaginationControlsCmp,
    MD_INPUT_DIRECTIVES
  ],
  pipes: [
    PaginatePipe,
    RsvpPipe,
    DisplayMainImagePipe
  ]
})
export class PartiesList extends PartiesListBase {
  constructor() {
    super();
  }
}
