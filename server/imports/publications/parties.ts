import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../both/collections/parties.collection';

Meteor.publish('parties', function() {
  const selector = {
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

  return Parties.find(selector);
});
