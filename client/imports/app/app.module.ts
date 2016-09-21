import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PARTIES_DECLARATIONS } from './parties';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    ...PARTIES_DECLARATIONS
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}