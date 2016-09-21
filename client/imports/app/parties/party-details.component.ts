import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';

import template from './party-details.component.html';

@Component({
  selector: 'party-details',
  template
})
export class PartyDetailsComponent implements OnInit, OnDestroy {
  partyId: string;
  paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => this.partyId = partyId);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
