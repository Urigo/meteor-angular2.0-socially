import {loadParties} from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';

import './imports/publications/parties';
import './imports/publications/users';

Meteor.startup(() => {
  // load initial Parties
  loadParties();
});
