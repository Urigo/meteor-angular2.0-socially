import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { GOOGLE_MAPS_DIRECTIVES, MouseEvent } from 'angular2-google-maps/core';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';
import { DisplayNamePipe } from '../shared/display-name.pipe';

import template from './party-details.component.html';

@Component({
  selector: 'party-details',
  template,
  directives: [ROUTER_DIRECTIVES, GOOGLE_MAPS_DIRECTIVES],
  pipes: [DisplayNamePipe]
})
@InjectUser('user')
export class PartyDetailsComponent extends MeteorComponent implements OnInit {
  partyId: string;
  party: Party;
  users: Mongo.Cursor<any>;
  user: Meteor.User;
  // Default center Palo Alto coordinates.
  centerLat: number = 37.4292;
  centerLng: number = -122.1381;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => {
        this.partyId = partyId;

        this.subscribe('party', this.partyId, () => {
          this.autorun(() => {
            this.party = Parties.findOne(this.partyId);
            this.getUsers(this.party);
          }, true);
        }, true);

        this.subscribe('uninvited', this.partyId, () => {
          this.getUsers(this.party);
        }, true);
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

  invite(user: Meteor.User) {
    this.call('invite', this.party._id, user._id, (error) => {
      if (error) {
        alert(`Failed to invite due to ${error}`);
        return;
      }

      alert('User successfully invited.');
    });
  }

  reply(rsvp: string) {
    this.call('reply', this.party._id, rsvp, (error) => {
      if (error) {
        alert(`Failed to reply due to ${error}`);
      } else {
        alert('You successfully replied.');
      }
    });
  }

  getUsers(party: Party) {
    if (party) {
      this.users = Meteor.users.find({
        _id: {
          $nin: party.invited || [],
          $ne: Meteor.userId()
        }
      });
    }
  }

  get isOwner(): boolean {
    return this.party && this.user && this.user._id === this.party.owner;
  }

  get isPublic(): boolean {
    return this.party && this.party.public;
  }

  get isInvited(): boolean {
    if (this.party && this.user) {
      const invited = this.party.invited || [];
      return invited.indexOf(this.user._id) !== -1;
    }

    return false;
  }

  get lat(): number {
    return this.party && this.party.location.lat;
  }

  get lng(): number {
    return this.party && this.party.location.lng;
  }

  mapClicked($event: MouseEvent) {
    this.party.location.lat = $event.coords.lat;
    this.party.location.lng = $event.coords.lng;
  }
}
