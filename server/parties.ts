import {Parties} from '../collections/parties';
import {Meteor} from 'meteor/meteor';

Meteor.publish('parties', function() {
  return Parties.find({
    $or: [
      { 'public': true },
      {
        $and: [
          { owner: this.userId },
          { owner: { $exists: true } }
        ]
      }
    ]
  });
});