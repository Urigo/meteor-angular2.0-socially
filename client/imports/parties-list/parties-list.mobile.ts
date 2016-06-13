import { Component } from '@angular/core';
import { PartiesList as PartiesListBase } from './parties-list.class';

@Component({
  templateUrl: '/client/imports/parties-list/parties-list.mobile.html'
})
export class PartiesList extends PartiesListBase {
  constructor() {
    super();
  }
}
