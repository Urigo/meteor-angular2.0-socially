import { Component } from '@angular/core';
import { PartiesList as PartiesListBase } from './parties-list.class';
import { RsvpPipe } from '../pipes/pipes';

@Component({
  templateUrl: '/client/imports/parties-list/parties-list.mobile.html',
  pipes: [
    RsvpPipe
  ]
})
export class PartiesList extends PartiesListBase {
  constructor() {
    super();
  }
}
