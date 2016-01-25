import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Parties} from '../../../collections/parties.ts';

import template from './party-details.html';

@Component({
  selector: 'party-details',
  template
})
export class PartyDetails {
  partyId: string;
  party: Object;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.partyId = params['partyId'];

      this.party = Parties.findOne(this.partyId);
    });
  }
}
