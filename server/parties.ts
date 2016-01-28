import {Parties} from '../collections/parties';
import {Meteor} from 'meteor/meteor';

Meteor.publish('parties', function() {
  return Parties.find();
});