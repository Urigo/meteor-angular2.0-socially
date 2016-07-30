import {loadParties} from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';

import './imports/publications/parties';
import './imports/publications/users';
import './imports/publications/images';
import '../both/methods/parties.methods';

Meteor.startup(() => {
  // load initial Parties
  loadParties();
});
