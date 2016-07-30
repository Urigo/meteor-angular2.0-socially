import { Component } from '@angular/core';
import { PaginationService, PaginationControlsCmp } from 'ng2-pagination';

import { PartiesList } from './parties-list.class';

import template from './parties-list.mobile.component.html';

@Component({
  template,
  viewProviders: [PaginationService],
  directives: [PaginationControlsCmp]
})
export class PartiesListComponent extends PartiesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
