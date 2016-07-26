import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';

import template from './party-details.component.html';

@Component({
  selector: 'party-details',
  template,
  directives: [ROUTER_DIRECTIVES]
})
export class PartyDetailsComponent implements OnInit {
  partyId: string;
  party: Party;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit() {
    this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => {
        this.partyId = partyId;

        Tracker.autorun(() => {
          this.ngZone.run(() => {
            this.party = Parties.findOne(this.partyId);
          });
        });
      });
  }

  saveParty() {
    if (Meteor.userId()) {
      Parties.update(this.party._id, {
        $set: {
          name: this.party.name,
          description: this.party.description,
          location: this.party.location
        }
      });
    } else {
      alert('Please log in to change this party');
    }
  }
}
