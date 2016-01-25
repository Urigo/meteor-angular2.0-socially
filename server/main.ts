import {loadParties} from './load-parties.ts';
import {Meteor} from 'meteor/meteor';

Meteor.startup(loadParties);