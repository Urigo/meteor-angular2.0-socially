import { RouterConfig, provideRouter } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { PartiesListComponent } from './imports/parties/parties-list.component';
import { PartyDetailsComponent } from './imports/parties/party-details.component';
import { LoginComponent } from './imports/auth/login.component';
import { SignupComponent } from './imports/auth/signup.component';
import { RecoverComponent } from './imports/auth/recover.component';

const routes: RouterConfig = [
  { path: '', component: PartiesListComponent },
  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['CanActivateForLoggedIn'] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  { provide: 'CanActivateForLoggedIn', useValue: () => !! Meteor.userId() }
];
