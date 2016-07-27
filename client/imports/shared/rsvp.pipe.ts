import { Pipe } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';

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
