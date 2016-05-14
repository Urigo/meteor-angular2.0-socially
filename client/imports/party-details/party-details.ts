import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

@Component({
  selector: 'party-details',
  templateUrl: '/client/imports/party-details/party-details.html'
})
export class PartyDetails {
  constructor(params: RouteParams) {
    var partyId = params.get('partyId');
  }
}