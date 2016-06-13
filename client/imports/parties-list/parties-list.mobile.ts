import { Component } from '@angular/core';
import { PartiesList as PartiesListBase } from './parties-list.class';
import template from './parties-list.mobile.html';

@Component({
  template
})
export class PartiesList extends PartiesListBase {
  constructor() {
    super();
  }
}
