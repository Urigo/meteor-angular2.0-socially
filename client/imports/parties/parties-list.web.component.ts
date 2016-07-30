import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { PaginationService, PaginationControlsCmp } from 'ng2-pagination';
import { GOOGLE_MAPS_DIRECTIVES } from 'angular2-google-maps/core';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

import { PartiesFormComponent } from './parties-form.component';
import { RsvpPipe } from '../shared/rsvp.pipe';
import { DisplayMainImagePipe } from '../shared/display-main-image.pipe';
import { PartiesList } from './parties-list.class';

import template from './parties-list.web.component.html';

@Component({
  selector: 'parties-list',
  template,
  viewProviders: [PaginationService],
  directives: [MD_CARD_DIRECTIVES, MD_TOOLBAR_DIRECTIVES, MD_INPUT_DIRECTIVES, GOOGLE_MAPS_DIRECTIVES, PartiesFormComponent, ROUTER_DIRECTIVES, PaginationControlsCmp],
  pipes: [RsvpPipe, DisplayMainImagePipe]
})
export class PartiesListComponent extends PartiesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
