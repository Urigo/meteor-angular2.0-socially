import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UploadFS } from 'meteor/jalik:ufs';

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

export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs,
  name: 'thumbs'
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
