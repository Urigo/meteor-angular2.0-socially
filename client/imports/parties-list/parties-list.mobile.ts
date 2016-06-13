import { Component } from '@angular/core';
import { PartiesList as PartiesListBase } from './parties-list.class';
import { RsvpPipe, DisplayMainImagePipe } from '../pipes/pipes';

@Component({
  templateUrl: '/client/imports/parties-list/parties-list.mobile.html',
  pipes: [
    RsvpPipe,
    DisplayMainImagePipe
  ]
})
export class PartiesList extends PartiesListBase {
  constructor() {
    super();
  }
}
