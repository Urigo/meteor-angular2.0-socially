import { Component } from '@angular/core';
import { RouteParams, RouterLink } from '@angular/router-deprecated';
import {Parties} from '../../../collections/parties.ts';

@Component({
  selector: 'party-details',
  templateUrl: '/client/imports/party-details/party-details.html',
  directives: [RouterLink]
})
export class PartyDetails {
  party: Object;

  constructor(params: RouteParams) {
    var partyId = params.get('partyId');
    this.party = Parties.findOne(partyId);
  }
}