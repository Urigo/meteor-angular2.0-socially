import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/models/party.model';

export function loadParties() {
  if (Parties.find().cursor.count() === 0) {
    const parties: Party[] = [{
      name: 'Dubstep-Free Zone',
      description: 'Can we please just for an evening not listen to dubstep.',
      location: {
        name: 'Palo Alto'
      },
      public: true
    }, {
      name: 'All dubstep all the time',
      description: 'Get it on!',
      location: {
        name: 'Palo Alto'
      },
      public: true
    }, {
      name: 'Savage lounging',
      description: 'Leisure suit required. And only fiercest manners.',
      location: {
        name: 'San Francisco'
      },
      public: false
    }];

    parties.forEach((party: Party) => Parties.insert(party));
  }
}