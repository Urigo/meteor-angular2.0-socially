import { Pipe } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { Meteor } from 'meteor/meteor';

import { Images } from '../../../both/collections/images.collection';
import { Party } from '../../../both/interfaces/party.interface';

@Pipe({
  name: 'displayMainImage',
  pure: false
})
export class DisplayMainImagePipe extends MeteorComponent {
  constructor() {
    super();
  }

  transform(party: Party) {
    if (!party) {
      return;
    }

    let imageUrl: string;
    let imageId: string = (party.images || [])[0];

    this.autorun(() => {
      const found = Images.findOne(imageId);
      if (found) {
        // XXX Make sure to use proper absolute url of an image
        // jalik:ufs sets an absolute path of a file (let's say localhost:3000)
        // Might be a problem when running an app in a different port (development)
        if (!Meteor.isCordova) {
          imageUrl = found.url;
        } else {
          const path = `ufs/${found.store}/${found._id}/${found.name}`;
          imageUrl = Meteor.absoluteUrl(path);
        }
      }
    }, true);

    return imageUrl;
  }
}
