import { RouterConfig, provideRouter } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { PartiesListComponent } from './imports/parties/parties-list.component';
import { PartyDetailsComponent } from './imports/parties/party-details.component';
import { LoginComponent as LoginWebComponent } from './imports/auth/login.web.component';
import { LoginComponent as LoginMobileComponent } from './imports/auth/login.mobile.component';
import { SignupComponent } from './imports/auth/signup.component';
import { RecoverComponent } from './imports/auth/recover.component';

const routes: RouterConfig = [
  { path: '', component: PartiesListComponent },
  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['CanActivateForLoggedIn'] },
  { path: 'login', component: Meteor.isCordova ? LoginMobileComponent : LoginWebComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  { provide: 'CanActivateForLoggedIn', useValue: () => !! Meteor.userId() }
];
