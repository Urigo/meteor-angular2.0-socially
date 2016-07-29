import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UploadFS } from 'meteor/jalik:ufs';

import { Image, Thumb } from '../interfaces/image.interface';

export const Images = new Mongo.Collection<Image>('images');
export const Thumbs = new Mongo.Collection<Thumb>('thumbs');

export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs,
  name: 'thumbs',
  transformWrite(from, to, fileId, file) {
    // Resize to 32x32
    const gm = require('gm');

    gm(from, file.name)
      .resize(32, 32)
      .gravity('Center')
      .extent(32, 32)
      .quality(75)
      .stream()
      .pipe(to);
  }
});

export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images,
  name: 'images',
  filter: new UploadFS.Filter({
    contentTypes: ['image/*']
  }),
  copyTo: [
    ThumbsStore
  ]
});

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
