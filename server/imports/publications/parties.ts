import {Parties} from '../../../both/collections/parties.collection';
import {Meteor} from 'meteor/meteor';

Meteor.publish('parties', () => Parties.find());
