import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Images = new Mongo.Collection('images');
export const Thumbs = new Mongo.Collection('thumbs');

function loggedIn(userId) {
  return !!userId;
}

Thumbs.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});

Images.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
