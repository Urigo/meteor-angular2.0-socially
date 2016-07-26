import {Parties} from '../../../both/collections/parties.collection';
import {Meteor} from 'meteor/meteor';

Meteor.publish('parties', function() {
  const selector = {
    $or: [
      { 'public': true },
      {
        $and: [
          { owner: this.userId },
          { owner: { $exists: true } }
        ]
      }
    ]
  };

  return Parties.find(selector);
});
