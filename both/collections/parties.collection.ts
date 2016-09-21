import { MongoObservable } from 'meteor-rxjs';

import { Party } from '../models/party.model';

export const Parties = new MongoObservable.Collection<Party>('parties');
