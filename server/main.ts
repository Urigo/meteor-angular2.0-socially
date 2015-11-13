import {loadParties} from './load_parties';
import './parties';

Meteor.startup(loadParties);
