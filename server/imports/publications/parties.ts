import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../both/collections/parties.collection';

Meteor.publish('parties', () => Parties.find());
