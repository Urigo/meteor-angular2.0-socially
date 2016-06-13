import { Component } from '@angular/core';
import { PartiesList as PartiesListBase } from './parties-list.class';
import template from './parties-list.mobile.html';
import { RsvpPipe, DisplayMainImagePipe } from '../pipes/pipes';

@Component({
  template,
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
