import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { Ng2PaginationModule } from 'ng2-pagination';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from "./app.component.web";
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { PARTIES_DECLARATIONS } from './parties';
import { SHARED_DECLARATIONS } from './shared';
import { MaterialModule } from "@angular/material";
import { AUTH_DECLARATIONS } from "./auth/index";
import { FileDropModule } from "angular2-file-drop";
import { MOBILE_DECLARATIONS } from "./mobile/index";
import { AppMobileComponent } from "./mobile/app.component.mobile";
import { IonicModule, IonicApp } from "ionic-angular";
import { PartiesListMobileComponent } from "./mobile/parties-list.component.mobile";

let moduleDefinition;

if (Meteor.isCordova) {
  moduleDefinition = {
    imports: [
      Ng2PaginationModule,
      IonicModule.forRoot(AppMobileComponent)
    ],
    declarations: [
      ...SHARED_DECLARATIONS,
      ...MOBILE_DECLARATIONS
    ],
    providers: [
    ],
    bootstrap: [
      IonicApp
    ],
    entryComponents: [
      PartiesListMobileComponent
    ]
  }
}
else {
  moduleDefinition = {
    imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forRoot(routes),
      AccountsModule,
      Ng2PaginationModule,
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
      }),
      MaterialModule.forRoot(),
      FileDropModule
    ],
    declarations: [
      AppComponent,
      ...PARTIES_DECLARATIONS,
      ...SHARED_DECLARATIONS,
      ...AUTH_DECLARATIONS
    ],
    providers: [
      ...ROUTES_PROVIDERS
    ],
    bootstrap: [
      AppComponent
    ]
  }
}

@NgModule(moduleDefinition)
export class AppModule {}