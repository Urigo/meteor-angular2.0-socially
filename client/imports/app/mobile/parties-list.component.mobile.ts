import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { PartiesList } from "../shared-components/parties-list.class";

import template from './parties-list.component.mobile.html';

@Component({
  selector: 'parties-list',
  template
})
export class PartiesListMobileComponent extends PartiesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
