import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { PartiesList } from "../shared-components/parties-list.class";

import template from './parties-list.component.html';
import style from './parties-list.component.scss';

@Component({
  selector: 'parties-list',
  template,
  styles: [ style ]
})
export class PartiesListComponent extends PartiesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
