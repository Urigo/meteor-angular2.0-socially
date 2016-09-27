import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import 'rxjs/add/operator/map';

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';

import template from './party-details.component.html';

@Component({
  selector: 'party-details',
  template
})
export class PartyDetailsComponent implements OnInit, OnDestroy {
  partyId: string;
  paramsSub: Subscription;
  party: Party;
  partySub: Subscription;
  users: Observable<User>;
  uninvitedSub: Subscription;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => {
        this.partyId = partyId;
        
        if (this.partySub) {
          this.partySub.unsubscribe();
        }

        this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
          this.party = Parties.findOne(this.partyId);
        });

        if (this.uninvitedSub) {
          this.uninvitedSub.unsubscribe();
        }

        this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.partyId).subscribe(() => {
           this.users = Users.find({
             _id: {
               $ne: Meteor.userId()
              }
            }).zone();
        });
      });
  }

  saveParty() {
    if (!Meteor.userId()) {
      alert('Please log in to change this party');
      return;
    }
    
    Parties.update(this.party._id, {
      $set: {
        name: this.party.name,
        description: this.party.description,
        location: this.party.location
      }
    });
  }

  invite(user: Meteor.User) {
    MeteorObservable.call('invite', this.party._id, user._id).subscribe(() => {
      alert('User successfully invited.');
    }, (error) => {
      alert(`Failed to invite due to ${error}`);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.partySub.unsubscribe();
    this.uninvitedSub.unsubscribe();
  }
}
