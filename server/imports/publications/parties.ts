import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../both/collections/parties.collection';

Meteor.publish('parties', function() {
  return Parties.find(buildQuery.call(this));
});

Meteor.publish('party', function(partyId: string) {
  return Parties.find(buildQuery.call(this, partyId));
});


function buildQuery(partyId?: string): Object {
  const isAvailable = {
    $or: [{
      // party is public
      public: true
    },
    // or
    { 
      // current user is the owner
      $and: [{
        owner: this.userId 
      }, {
        owner: {
          $exists: true
        }
      }]
    }]
  };

  if (partyId) {
    return {
      // only single party
      $and: [{
          _id: partyId
        },
        isAvailable
      ]
    };
  }

  return isAvailable;
}