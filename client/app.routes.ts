import { RouterConfig, provideRouter } from '@angular/router';

import { PartiesListComponent } from './imports/parties/parties-list.component';

const routes: RouterConfig = [
  { path: '', component: PartiesListComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
