import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Image, Thumb } from '../interfaces/image.interface';

export const Images = new Mongo.Collection<Image>('images');
export const Thumbs = new Mongo.Collection<Thumb>('thumbs');

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
