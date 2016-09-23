import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Parties } from '../../../both/collections/parties.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('parties', function(options: Options) {
  Counts.publish(this, 'numberOfParties', Parties.collection.find(buildQuery.call(this)), { noReady: true });

  return Parties.find(buildQuery.call(this), options);
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