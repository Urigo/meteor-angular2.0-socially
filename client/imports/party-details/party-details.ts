import { Component } from '@angular/core';
import { RouteParams, RouterLink } from '@angular/router-deprecated';
import {Parties} from '../../../collections/parties.ts';
import { Meteor } from 'meteor/meteor';
import { RequireUser } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';
import { DisplayName } from '../pipes/pipes.ts';
import { Mongo } from 'meteor/mongo';

@Component({
  selector: 'party-details',
  templateUrl: '/client/imports/party-details/party-details.html',
  directives: [RouterLink],
  pipes: [DisplayName]
})
@RequireUser()
export class PartyDetails extends MeteorComponent {
  party: Party;
  users: Mongo.Cursor<Object>;

  constructor(params: RouteParams) {
    super();
    var partyId = params.get('partyId');

    this.subscribe('party', partyId, () => {
      this.autorun(() => {
        this.party = Parties.findOne(partyId);
        this.getUsers(this.party);
      },   true);
    });

    this.subscribe('uninvited', partyId, () => {
      this.getUsers(this.party);
    }, true);
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

  saveParty(party) {
    if (Meteor.userId()) {
      Parties.update(party._id, {
        $set: {
          name: party.name,
          description: party.description,
          location: party.location
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
      }
      else {
        alert('You successfully replied.');
      }
    });
  }
}