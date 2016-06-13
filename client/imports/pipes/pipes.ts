import 'reflect-metadata';
import { Pipe } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../collections/parties.ts';
import { Images } from '../../../collections/images';
import { MeteorComponent } from 'angular2-meteor';

@Pipe({
  name: 'displayName'
})
export class DisplayName {
  transform(user: Meteor.User): string {
    if (!user) {
      return '';
    }

    if (user.username) {
      return user.username;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return '';
  }
}

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


@Pipe({
  name: 'rsvp',
  pure: false
})
export class RsvpPipe extends MeteorComponent {
  init: boolean = false;
  total: number = 0;

  transform(party: Party, type: string): number {
    if (!type) {
      return 0;
    }

    if (!this.init) {
      this.autorun(() => {
        const found = Parties.findOne(party._id);
        if (found) {
          this.total = found.rsvps ?
            found.rsvps.filter(rsvp => rsvp.response === type).length : 0;
        }
      }, true);
      this.init = true;
    }

    return this.total;
  }
}
