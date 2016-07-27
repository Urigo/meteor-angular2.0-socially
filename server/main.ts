import {loadParties} from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';

import './imports/publications/parties';
import './imports/publications/users';
import '../both/methods/parties.methods';

Meteor.startup(() => {
  // load initial Parties
  loadParties();
});
