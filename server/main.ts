import {loadParties} from './load-parties.ts';
import {Meteor} from 'meteor/meteor';
import './parties.ts';

Meteor.startup(loadParties);