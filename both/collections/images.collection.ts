import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

export const Images = new MongoObservable.Collection('images');
export const Thumbs = new MongoObservable.Collection('thumbs');
