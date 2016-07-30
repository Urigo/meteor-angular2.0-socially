import { Pipe } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

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
        imageUrl = found.url;
      }
    }, true);

    return imageUrl;
  }
}
