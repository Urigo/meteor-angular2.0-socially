import {loadParties} from './load-parties.ts';
import {Meteor} from 'meteor/meteor';
import './parties.ts';
import './users.ts';
import '../collections/methods.ts';

Meteor.startup(loadParties);