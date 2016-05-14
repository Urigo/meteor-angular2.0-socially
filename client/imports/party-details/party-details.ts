import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import template from './party-details.html';

@Component({
  selector: 'party-details',
  template
})
export class PartyDetails {
  partyId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.partyId = params['partyId'];
    });
  }
}
