import { Meteor } from 'meteor/meteor';
import { Thumbs, Images } from '../../../both/collections/images.collection';

Meteor.publish('thumbs', function(ids: string[]) {
  return Thumbs.collection.find({
    originalStore: 'images',
    originalId: {
      $in: ids
    }
  });
});

Meteor.publish('images', function() {
  return Images.collection.find({});
});