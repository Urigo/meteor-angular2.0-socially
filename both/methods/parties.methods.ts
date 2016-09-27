import {Parties} from '../collections/parties.collection';
import {Email} from 'meteor/email';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

function getContactEmail(user:Meteor.User):string {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  return null;
}

Meteor.methods({
  invite: function (partyId:string, userId:string) {
    check(partyId, String);
    check(userId, String);

    let party = Parties.collection.findOne(partyId);

    if (!party)
      throw new Meteor.Error('404', 'No such party!');

    if (party.public)
      throw new Meteor.Error('400', 'That party is public. No need to invite people.');

    if (party.owner !== this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    if (userId !== party.owner && (party.invited || []).indexOf(userId) == -1) {
      Parties.collection.update(partyId, {$addToSet: {invited: userId}});

      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        Email.send({
          from: 'noreply@socially.com',
          to: to,
          replyTo: from || undefined,
          subject: 'PARTY: ' + party.name,
          text: `Hi, I just invited you to ${party.name} on Socially.
                        \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
        });
      }
    }
  },
  reply: function(partyId: string, rsvp: string) {
    check(partyId, String);
    check(rsvp, String);

    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to reply');

    if (['yes', 'no', 'maybe'].indexOf(rsvp) === -1)
      throw new Meteor.Error('400', 'Invalid RSVP');

    let party = Parties.findOne({ _id: partyId });

    if (!party)
      throw new Meteor.Error('404', 'No such party');

    if (party.owner === this.userId)
      throw new Meteor.Error('500', 'You are the owner!');

    if (!party.public && (!party.invited || party.invited.indexOf(this.userId) == -1))
      throw new Meteor.Error('403', 'No such party'); // its private, but let's not tell this to the user

    let rsvpIndex = party.rsvps ? party.rsvps.findIndex((rsvp) => rsvp.userId === this.userId) : -1;

    if (rsvpIndex !== -1) {
      // update existing rsvp entry
      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Parties.update(
          { _id: partyId, 'rsvps.userId': this.userId },
          { $set: { 'rsvps.$.response': rsvp } });
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        let modifier = { $set: {} };
        modifier.$set['rsvps.' + rsvpIndex + '.response'] = rsvp;

        Parties.update(partyId, modifier);
      }
    } else {
      // add new rsvp entry
      Parties.update(partyId,
        { $push: { rsvps: { userId: this.userId, response: rsvp } } });
    }
  }
});