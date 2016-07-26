import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms()
]);
