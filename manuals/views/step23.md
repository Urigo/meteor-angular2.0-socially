[{]: <region> (header)
# Step 23: Ionic
[}]: #
[{]: <region> (body)
Ionic is a CSS and JavaScript framework. It is highly recommended that before starting this step you will get yourself familiar with its [documentation](http://ionicframework.com/docs/v2).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications.

We will achieve this by creating separate views for web and for mobile  so be creating a separate view for the mobile applications, but we will keep the shared code parts as common code!

### Adding Ionic

Using ionic is pretty simple - first, we need to install it:

    $ meteor npm install ionic-angular --save

We also have to install missing packages that required by Ionic:

    $ meteor npm install @angular/http @angular/platform-server --save

### Separate web and mobile things

We are going to have two different `NgModule`s, because of the differences in the imports and declarations between the two platforms (web and Ionic).

We will also separate the main `Component` that in use.

So let's start with the `AppComponent` that needed to be change to `app.component.web.ts`, and it's template that ness to be called `app.component.web.html`.

Now update the usage of the template in the Component:

[{]: <helper> (diff_step 23.4)
#### Step 23.4: Updated the template import

##### Changed client/imports/app/app.component.web.ts
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import { Component } from '@angular/core';
 ┊2┊2┊
-┊3┊ ┊import template from './app.component.html';
 ┊4┊3┊import style from './app.component.scss';
+┊ ┊4┊import template from './app.component.web.html';
 ┊5┊5┊import {InjectUser} from "angular2-meteor-accounts-ui";
 ┊6┊6┊
 ┊7┊7┊@Component({
```
[}]: #

And modify the import path in the module file:

[{]: <helper> (diff_step 23.5)
#### Step 23.5: Updated the main component import

##### Changed client/imports/app/app.module.ts
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊import { Ng2PaginationModule } from 'ng2-pagination';
 ┊ 7┊ 7┊import { AgmCoreModule } from 'angular2-google-maps/core';
 ┊ 8┊ 8┊
-┊ 9┊  ┊import { AppComponent } from './app.component';
+┊  ┊ 9┊import { AppComponent } from "./app.component.web";
 ┊10┊10┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊11┊11┊import { PARTIES_DECLARATIONS } from './parties';
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
```
[}]: #

Now let's take back the code we modified in the previous step (#21) and use only the original version of the Login component, because we do not want to have login in our Ionic version (it will be read only):

[{]: <helper> (diff_step 23.6)
#### Step 23.6: Use web version of Login component in routing

##### Changed client/imports/app/app.routes.ts
```diff
@@ -5,13 +5,12 @@
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {SignupComponent} from "./auth/signup.component";
 ┊ 7┊ 7┊import {RecoverComponent} from "./auth/recover.component";
-┊ 8┊  ┊import {MobileLoginComponent} from "./auth/login.component.mobile";
 ┊ 9┊ 8┊import {LoginComponent} from "./auth/login.component.web";
 ┊10┊ 9┊
 ┊11┊10┊export const routes: Route[] = [
 ┊12┊11┊  { path: '', component: PartiesListComponent },
 ┊13┊12┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
-┊14┊  ┊  { path: 'login', component: Meteor.isCordova ? MobileLoginComponent : LoginComponent },
+┊  ┊13┊  { path: 'login', component: LoginComponent },
 ┊15┊14┊  { path: 'signup', component: SignupComponent },
 ┊16┊15┊  { path: 'recover', component: RecoverComponent }
 ┊17┊16┊];
```
[}]: #

Create a root Component for the mobile, and call it `AppMobileComponent`:

[{]: <helper> (diff_step 23.7)
#### Step 23.7: Created the main mobile component

##### Added client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊import {Component} from "@angular/core";
+┊  ┊ 2┊import template from "./app.component.mobile.html";
+┊  ┊ 3┊import {MenuController, Platform, App} from "ionic-angular";
+┊  ┊ 4┊
+┊  ┊ 5┊@Component({
+┊  ┊ 6┊  selector: "app",
+┊  ┊ 7┊  template
+┊  ┊ 8┊})
+┊  ┊ 9┊export class AppMobileComponent {
+┊  ┊10┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊11┊
+┊  ┊12┊  }
+┊  ┊13┊}🚫↵
```
[}]: #

And let's create it's view:

[{]: <helper> (diff_step 23.8)
#### Step 23.8: Created the main mobile component view

##### Added client/imports/app/mobile/app.component.mobile.html
```diff
@@ -0,0 +1 @@
+┊ ┊1┊<ion-nav [root]="rootPage" swipe-back-enabled="true"></ion-nav>🚫↵
```
[}]: #

We used `ion-nav` which is the navigation bar of Ionic, we also declared that our root page is `rootPage` which we will add later.

Now let's create an index file for the ionic component declarations:

[{]: <helper> (diff_step 23.9)
#### Step 23.9: Created index file for mobile declarations

##### Added client/imports/app/mobile/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import {AppMobileComponent} from "./app.component.mobile";
+┊ ┊2┊
+┊ ┊3┊export const MOBILE_DECLARATIONS = [
+┊ ┊4┊  AppMobileComponent
+┊ ┊5┊];🚫↵
```
[}]: #

## Modules Separation

In order to create two different versions of `NgModule` - one for each platform, we need to identify which platform are we running now - we already know how to do this from the previous step - we will use `Meteor.isCordova`.

We will have a single `NgModule` called `AppModule`, but it's declaration will be different according to the platform.

So we already know how the web module looks like, we just need to understand how mobile module defined when working with Ionic.

First - we need to import `IonicModule` and declare our root Component there.

We also need to declare `IonicApp` as our `bootstrap` Component, and add every Ionic `page` to the `entryComponents`.

So let's create it and differ the platform:

[{]: <helper> (diff_step 23.10)
#### Step 23.10: Imported mobile declarations and added conditional main component bootstrap

##### Changed client/imports/app/app.module.ts
```diff
@@ -13,32 +13,60 @@
 ┊13┊13┊import { MaterialModule } from "@angular/material";
 ┊14┊14┊import { AUTH_DECLARATIONS } from "./auth/index";
 ┊15┊15┊import { FileDropModule } from "angular2-file-drop";
+┊  ┊16┊import { MOBILE_DECLARATIONS } from "./mobile/index";
+┊  ┊17┊import { AppMobileComponent } from "./mobile/app.component.mobile";
+┊  ┊18┊import { IonicModule, IonicApp } from "ionic-angular";
 ┊16┊19┊
-┊17┊  ┊@NgModule({
-┊18┊  ┊  imports: [
-┊19┊  ┊    BrowserModule,
-┊20┊  ┊    FormsModule,
-┊21┊  ┊    ReactiveFormsModule,
-┊22┊  ┊    RouterModule.forRoot(routes),
-┊23┊  ┊    AccountsModule,
-┊24┊  ┊    Ng2PaginationModule,
-┊25┊  ┊    AgmCoreModule.forRoot({
-┊26┊  ┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
-┊27┊  ┊    }),
-┊28┊  ┊    MaterialModule.forRoot(),
-┊29┊  ┊    FileDropModule
-┊30┊  ┊  ],
-┊31┊  ┊  declarations: [
-┊32┊  ┊    AppComponent,
-┊33┊  ┊    ...PARTIES_DECLARATIONS,
-┊34┊  ┊    ...SHARED_DECLARATIONS,
-┊35┊  ┊    ...AUTH_DECLARATIONS
-┊36┊  ┊  ],
-┊37┊  ┊  providers: [
-┊38┊  ┊    ...ROUTES_PROVIDERS
-┊39┊  ┊  ],
-┊40┊  ┊  bootstrap: [
-┊41┊  ┊    AppComponent
-┊42┊  ┊  ]
-┊43┊  ┊})
+┊  ┊20┊let moduleDefinition;
+┊  ┊21┊
+┊  ┊22┊if (Meteor.isCordova) {
+┊  ┊23┊  moduleDefinition = {
+┊  ┊24┊    imports: [
+┊  ┊25┊      IonicModule.forRoot(AppMobileComponent)
+┊  ┊26┊    ],
+┊  ┊27┊    declarations: [
+┊  ┊28┊      ...SHARED_DECLARATIONS,
+┊  ┊29┊      ...MOBILE_DECLARATIONS
+┊  ┊30┊    ],
+┊  ┊31┊    providers: [
+┊  ┊32┊    ],
+┊  ┊33┊    bootstrap: [
+┊  ┊34┊      IonicApp
+┊  ┊35┊    ],
+┊  ┊36┊    entryComponents: [
+┊  ┊37┊      AppMobileComponent
+┊  ┊38┊    ]
+┊  ┊39┊  }
+┊  ┊40┊}
+┊  ┊41┊else {
+┊  ┊42┊  moduleDefinition = {
+┊  ┊43┊    imports: [
+┊  ┊44┊      BrowserModule,
+┊  ┊45┊      FormsModule,
+┊  ┊46┊      ReactiveFormsModule,
+┊  ┊47┊      RouterModule.forRoot(routes),
+┊  ┊48┊      AccountsModule,
+┊  ┊49┊      Ng2PaginationModule,
+┊  ┊50┊      AgmCoreModule.forRoot({
+┊  ┊51┊        apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
+┊  ┊52┊      }),
+┊  ┊53┊      MaterialModule.forRoot(),
+┊  ┊54┊      FileDropModule
+┊  ┊55┊    ],
+┊  ┊56┊    declarations: [
+┊  ┊57┊      AppComponent,
+┊  ┊58┊      ...PARTIES_DECLARATIONS,
+┊  ┊59┊      ...SHARED_DECLARATIONS,
+┊  ┊60┊      ...AUTH_DECLARATIONS
+┊  ┊61┊    ],
+┊  ┊62┊    providers: [
+┊  ┊63┊      ...ROUTES_PROVIDERS
+┊  ┊64┊    ],
+┊  ┊65┊    bootstrap: [
+┊  ┊66┊      AppComponent
+┊  ┊67┊    ]
+┊  ┊68┊  }
+┊  ┊69┊}
+┊  ┊70┊
+┊  ┊71┊@NgModule(moduleDefinition)
 ┊44┊72┊export class AppModule {}🚫↵
```
[}]: #

Our next step is to change our selector of the root Component.

As we already know, the root Component of the web platform uses `<app>` tag as the selector, but in our case the root Component has to be `IonicApp` that uses `<ion-app>` tag.

So we need to have the ability to switch `<app>` to `<ion-app>` when using mobile platform.

There is a package called `ionic-selector` we can use in order to get this done, so let's add it:

    $ meteor npm install --save ionic-selector

Now let's use in before bootstrapping our module:

[{]: <helper> (diff_step 23.12)
#### Step 23.12: Use ionic-selector package

##### Changed client/main.ts
```diff
@@ -6,7 +6,13 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import '../both/methods/parties.methods';
 ┊ 8┊ 8┊
+┊  ┊ 9┊import ionicSelector from 'ionic-selector';
+┊  ┊10┊
 ┊ 9┊11┊Meteor.startup(() => {
+┊  ┊12┊  if (Meteor.isCordova) {
+┊  ┊13┊    ionicSelector("app");
+┊  ┊14┊  }
+┊  ┊15┊
 ┊10┊16┊  const platform = platformBrowserDynamic();
 ┊11┊17┊  platform.bootstrapModule(AppModule);
 ┊12┊18┊});🚫↵
```
[}]: #

What it does? It's changing tag name of the main component (`app` by default but you can specify any selector you want) to `ion-app`.

An example:

```html
<body>
  <app class="main"></app>
</body>
```

will be changed to:

```html
<body>
  <ion-app class="main"></ion-app>
</body>
```

## Ionic styles & icons

Our next step is to load Ionic style and icons (called `ionicons`) only to the mobile platform.

Start by adding the icons package:

    $ meteor npm install --save ionicons

Also, let's create a style file for the mobile and Ionic styles, and load the icons package to it:

[{]: <helper> (diff_step 23.14)
#### Step 23.14: Create ionic.scss and add ionicons to it

##### Added client/imports/app/mobile/ionic.scss
```diff
@@ -0,0 +1 @@
+┊ ┊1┊@import "{}/node_modules/ionicons/dist/scss/ionicons";🚫↵
```
[}]: #

And let's imports this file into our main styles file:

[{]: <helper> (diff_step 23.15)
#### Step 23.15: Import ionic.scss to main file

##### Changed client/main.scss
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊@import '../node_modules/@angular/material/core/theming/all-theme';
+┊ ┊2┊@import "imports/app/mobile/ionic.scss";
 ┊2┊3┊
 ┊3┊4┊@include md-core();
 ┊4┊5┊$app-primary: md-palette($md-light-blue, 500, 100, 700);
```
[}]: #

Now we need to load Ionic stylesheet into our project - but we need to load it only to the mobile platform, without loading it to the web platform (otherwise, it will override our styles):

[{]: <helper> (diff_step 23.16)
#### Step 23.16: Imported the main css file of ionic

##### Changed client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -2,6 +2,10 @@
 ┊ 2┊ 2┊import template from "./app.component.mobile.html";
 ┊ 3┊ 3┊import {MenuController, Platform, App} from "ionic-angular";
 ┊ 4┊ 4┊
+┊  ┊ 5┊if (Meteor.isCordova) {
+┊  ┊ 6┊  require("ionic-angular/css/ionic.css");
+┊  ┊ 7┊}
+┊  ┊ 8┊
 ┊ 5┊ 9┊@Component({
 ┊ 6┊10┊  selector: "app",
 ┊ 7┊11┊  template
```
[}]: #

We also need to add some CSS classes in order to get a good result:

[{]: <helper> (diff_step 23.17)
#### Step 23.17: Add two classes to fix an issue with overflow

##### Changed client/main.scss
```diff
@@ -19,6 +19,15 @@
 ┊19┊19┊  margin: 0;
 ┊20┊20┊}
 ┊21┊21┊
+┊  ┊22┊body.mobile {
+┊  ┊23┊  overflow: hidden;
+┊  ┊24┊}
+┊  ┊25┊
+┊  ┊26┊body.web {
+┊  ┊27┊  overflow: visible;
+┊  ┊28┊  position: initial;
+┊  ┊29┊}
+┊  ┊30┊
 ┊22┊31┊.sebm-google-map-container {
 ┊23┊32┊  width: 450px;
 ┊24┊33┊  height: 450px;
```
[}]: #

And let's add the correct class to the `body`:

[{]: <helper> (diff_step 23.18)
#### Step 23.18: Set the proper class on body

##### Changed client/main.ts
```diff
@@ -8,9 +8,20 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊import ionicSelector from 'ionic-selector';
 ┊10┊10┊
+┊  ┊11┊function setClass(css) {
+┊  ┊12┊  if (!document.body.className) {
+┊  ┊13┊    document.body.className = "";
+┊  ┊14┊  }
+┊  ┊15┊  document.body.className += " " + css;
+┊  ┊16┊}
+┊  ┊17┊
 ┊11┊18┊Meteor.startup(() => {
 ┊12┊19┊  if (Meteor.isCordova) {
 ┊13┊20┊    ionicSelector("app");
+┊  ┊21┊    setClass('mobile');
+┊  ┊22┊  }
+┊  ┊23┊  else {
+┊  ┊24┊    setClass('web');
 ┊14┊25┊  }
 ┊15┊26┊
 ┊16┊27┊  const platform = platformBrowserDynamic();
```
[}]: #

> We created a mechanism that adds `web` or `mobile` class to `<body/>` element depends on environment.

## Share logic between platforms

We want to share the logic of `PartiesListComponent` without sharing it's styles and template - because we want a different looks between the platforms.

In order to do so, let's take all of the logic we have in `PartiesListComponent` and take it to an external file that won't contain the Component decorator:

[{]: <helper> (diff_step 23.19)
#### Step 23.19: Take the logic of parties list to external class

##### Added client/imports/app/shared-components/parties-list.class.ts
```diff
@@ -0,0 +1,112 @@
+┊   ┊  1┊import {OnDestroy, OnInit} from "@angular/core";
+┊   ┊  2┊import {Observable, Subscription, Subject} from "rxjs";
+┊   ┊  3┊import {Party} from "../../../../both/models/party.model";
+┊   ┊  4┊import {PaginationService} from "ng2-pagination";
+┊   ┊  5┊import {MeteorObservable} from "meteor-rxjs";
+┊   ┊  6┊import {Parties} from "../../../../both/collections/parties.collection";
+┊   ┊  7┊import {Counts} from "meteor/tmeasday:publish-counts";
+┊   ┊  8┊import {InjectUser} from "angular2-meteor-accounts-ui";
+┊   ┊  9┊
+┊   ┊ 10┊interface Pagination {
+┊   ┊ 11┊  limit: number;
+┊   ┊ 12┊  skip: number;
+┊   ┊ 13┊}
+┊   ┊ 14┊
+┊   ┊ 15┊interface Options extends Pagination {
+┊   ┊ 16┊  [key: string]: any
+┊   ┊ 17┊}
+┊   ┊ 18┊
+┊   ┊ 19┊@InjectUser('user')
+┊   ┊ 20┊export class PartiesList implements OnInit, OnDestroy {
+┊   ┊ 21┊  parties: Observable<Party[]>;
+┊   ┊ 22┊  partiesSub: Subscription;
+┊   ┊ 23┊  pageSize: Subject<number> = new Subject<number>();
+┊   ┊ 24┊  curPage: Subject<number> = new Subject<number>();
+┊   ┊ 25┊  nameOrder: Subject<number> = new Subject<number>();
+┊   ┊ 26┊  optionsSub: Subscription;
+┊   ┊ 27┊  partiesSize: number = 0;
+┊   ┊ 28┊  autorunSub: Subscription;
+┊   ┊ 29┊  location: Subject<string> = new Subject<string>();
+┊   ┊ 30┊  user: Meteor.User;
+┊   ┊ 31┊  imagesSubs: Subscription;
+┊   ┊ 32┊
+┊   ┊ 33┊  constructor(private paginationService: PaginationService) {
+┊   ┊ 34┊
+┊   ┊ 35┊  }
+┊   ┊ 36┊
+┊   ┊ 37┊  ngOnInit() {
+┊   ┊ 38┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
+┊   ┊ 39┊
+┊   ┊ 40┊    this.optionsSub = Observable.combineLatest(
+┊   ┊ 41┊      this.pageSize,
+┊   ┊ 42┊      this.curPage,
+┊   ┊ 43┊      this.nameOrder,
+┊   ┊ 44┊      this.location
+┊   ┊ 45┊    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
+┊   ┊ 46┊      const options: Options = {
+┊   ┊ 47┊        limit: pageSize as number,
+┊   ┊ 48┊        skip: ((curPage as number) - 1) * (pageSize as number),
+┊   ┊ 49┊        sort: { name: nameOrder as number }
+┊   ┊ 50┊      };
+┊   ┊ 51┊
+┊   ┊ 52┊      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);
+┊   ┊ 53┊
+┊   ┊ 54┊      if (this.partiesSub) {
+┊   ┊ 55┊        this.partiesSub.unsubscribe();
+┊   ┊ 56┊      }
+┊   ┊ 57┊
+┊   ┊ 58┊      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
+┊   ┊ 59┊        this.parties = Parties.find({}, {
+┊   ┊ 60┊          sort: {
+┊   ┊ 61┊            name: nameOrder
+┊   ┊ 62┊          }
+┊   ┊ 63┊        }).zone();
+┊   ┊ 64┊      });
+┊   ┊ 65┊    });
+┊   ┊ 66┊
+┊   ┊ 67┊    this.paginationService.register({
+┊   ┊ 68┊      id: this.paginationService.defaultId,
+┊   ┊ 69┊      itemsPerPage: 10,
+┊   ┊ 70┊      currentPage: 1,
+┊   ┊ 71┊      totalItems: this.partiesSize
+┊   ┊ 72┊    });
+┊   ┊ 73┊
+┊   ┊ 74┊    this.pageSize.next(10);
+┊   ┊ 75┊    this.curPage.next(1);
+┊   ┊ 76┊    this.nameOrder.next(1);
+┊   ┊ 77┊    this.location.next('');
+┊   ┊ 78┊
+┊   ┊ 79┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
+┊   ┊ 80┊      this.partiesSize = Counts.get('numberOfParties');
+┊   ┊ 81┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
+┊   ┊ 82┊    });
+┊   ┊ 83┊  }
+┊   ┊ 84┊
+┊   ┊ 85┊  removeParty(party: Party): void {
+┊   ┊ 86┊    Parties.remove(party._id);
+┊   ┊ 87┊  }
+┊   ┊ 88┊
+┊   ┊ 89┊  search(value: string): void {
+┊   ┊ 90┊    this.curPage.next(1);
+┊   ┊ 91┊    this.location.next(value);
+┊   ┊ 92┊  }
+┊   ┊ 93┊
+┊   ┊ 94┊  onPageChanged(page: number): void {
+┊   ┊ 95┊    this.curPage.next(page);
+┊   ┊ 96┊  }
+┊   ┊ 97┊
+┊   ┊ 98┊  changeSortOrder(nameOrder: string): void {
+┊   ┊ 99┊    this.nameOrder.next(parseInt(nameOrder));
+┊   ┊100┊  }
+┊   ┊101┊
+┊   ┊102┊  isOwner(party: Party): boolean {
+┊   ┊103┊    return this.user && this.user._id === party.owner;
+┊   ┊104┊  }
+┊   ┊105┊
+┊   ┊106┊  ngOnDestroy() {
+┊   ┊107┊    this.partiesSub.unsubscribe();
+┊   ┊108┊    this.optionsSub.unsubscribe();
+┊   ┊109┊    this.autorunSub.unsubscribe();
+┊   ┊110┊    this.imagesSubs.unsubscribe();
+┊   ┊111┊  }
+┊   ┊112┊}🚫↵
```
[}]: #

And let's clean up the `PartiesListComponent`, and use the new class `PartiesList` as base class for this Component:

[{]: <helper> (diff_step 23.20)
#### Step 23.20: Create a clean parties list for web display

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -1,125 +1,17 @@
-┊  1┊   ┊import { Component, OnInit, OnDestroy } from '@angular/core';
-┊  2┊   ┊import { Observable } from 'rxjs/Observable';
-┊  3┊   ┊import { Subject } from 'rxjs/Subject';
-┊  4┊   ┊import { Subscription } from 'rxjs/Subscription';
-┊  5┊   ┊import { MeteorObservable } from 'meteor-rxjs';
+┊   ┊  1┊import { Component } from '@angular/core';
 ┊  6┊  2┊import { PaginationService } from 'ng2-pagination';
-┊  7┊   ┊import { Counts } from 'meteor/tmeasday:publish-counts';
-┊  8┊   ┊import { InjectUser } from "angular2-meteor-accounts-ui";
-┊  9┊   ┊
-┊ 10┊   ┊import 'rxjs/add/operator/combineLatest';
-┊ 11┊   ┊
-┊ 12┊   ┊import { Parties } from '../../../../both/collections/parties.collection';
-┊ 13┊   ┊import { Party } from '../../../../both/models/party.model';
+┊   ┊  3┊import { PartiesList } from "../shared-components/parties-list.class";
 ┊ 14┊  4┊
 ┊ 15┊  5┊import template from './parties-list.component.html';
 ┊ 16┊  6┊import style from './parties-list.component.scss';
 ┊ 17┊  7┊
-┊ 18┊   ┊interface Pagination {
-┊ 19┊   ┊  limit: number;
-┊ 20┊   ┊  skip: number;
-┊ 21┊   ┊}
-┊ 22┊   ┊
-┊ 23┊   ┊interface Options extends Pagination {
-┊ 24┊   ┊  [key: string]: any
-┊ 25┊   ┊}
-┊ 26┊   ┊
 ┊ 27┊  8┊@Component({
 ┊ 28┊  9┊  selector: 'parties-list',
 ┊ 29┊ 10┊  template,
 ┊ 30┊ 11┊  styles: [ style ]
 ┊ 31┊ 12┊})
-┊ 32┊   ┊@InjectUser('user')
-┊ 33┊   ┊export class PartiesListComponent implements OnInit, OnDestroy {
-┊ 34┊   ┊  parties: Observable<Party[]>;
-┊ 35┊   ┊  partiesSub: Subscription;
-┊ 36┊   ┊  pageSize: Subject<number> = new Subject<number>();
-┊ 37┊   ┊  curPage: Subject<number> = new Subject<number>();
-┊ 38┊   ┊  nameOrder: Subject<number> = new Subject<number>();
-┊ 39┊   ┊  optionsSub: Subscription;
-┊ 40┊   ┊  partiesSize: number = 0;
-┊ 41┊   ┊  autorunSub: Subscription;
-┊ 42┊   ┊  location: Subject<string> = new Subject<string>();
-┊ 43┊   ┊  user: Meteor.User;
-┊ 44┊   ┊  imagesSubs: Subscription;
-┊ 45┊   ┊
-┊ 46┊   ┊  constructor(
-┊ 47┊   ┊    private paginationService: PaginationService
-┊ 48┊   ┊  ) {}
-┊ 49┊   ┊
-┊ 50┊   ┊  ngOnInit() {
-┊ 51┊   ┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
-┊ 52┊   ┊
-┊ 53┊   ┊    this.optionsSub = Observable.combineLatest(
-┊ 54┊   ┊      this.pageSize,
-┊ 55┊   ┊      this.curPage,
-┊ 56┊   ┊      this.nameOrder,
-┊ 57┊   ┊      this.location
-┊ 58┊   ┊    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
-┊ 59┊   ┊      const options: Options = {
-┊ 60┊   ┊        limit: pageSize as number,
-┊ 61┊   ┊        skip: ((curPage as number) - 1) * (pageSize as number),
-┊ 62┊   ┊        sort: { name: nameOrder as number }
-┊ 63┊   ┊      };
-┊ 64┊   ┊
-┊ 65┊   ┊      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);
-┊ 66┊   ┊
-┊ 67┊   ┊      if (this.partiesSub) {
-┊ 68┊   ┊        this.partiesSub.unsubscribe();
-┊ 69┊   ┊      }
-┊ 70┊   ┊      
-┊ 71┊   ┊      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
-┊ 72┊   ┊        this.parties = Parties.find({}, {
-┊ 73┊   ┊          sort: {
-┊ 74┊   ┊            name: nameOrder
-┊ 75┊   ┊          }
-┊ 76┊   ┊        }).zone();
-┊ 77┊   ┊      });
-┊ 78┊   ┊    });
-┊ 79┊   ┊
-┊ 80┊   ┊    this.paginationService.register({
-┊ 81┊   ┊      id: this.paginationService.defaultId,
-┊ 82┊   ┊      itemsPerPage: 10,
-┊ 83┊   ┊      currentPage: 1,
-┊ 84┊   ┊      totalItems: this.partiesSize
-┊ 85┊   ┊    });
-┊ 86┊   ┊
-┊ 87┊   ┊    this.pageSize.next(10);
-┊ 88┊   ┊    this.curPage.next(1);
-┊ 89┊   ┊    this.nameOrder.next(1);
-┊ 90┊   ┊    this.location.next('');
-┊ 91┊   ┊
-┊ 92┊   ┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
-┊ 93┊   ┊      this.partiesSize = Counts.get('numberOfParties');
-┊ 94┊   ┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
-┊ 95┊   ┊    });
-┊ 96┊   ┊  }
-┊ 97┊   ┊
-┊ 98┊   ┊  removeParty(party: Party): void {
-┊ 99┊   ┊    Parties.remove(party._id);
-┊100┊   ┊  }
-┊101┊   ┊
-┊102┊   ┊  search(value: string): void {
-┊103┊   ┊    this.curPage.next(1);
-┊104┊   ┊    this.location.next(value);
-┊105┊   ┊  }
-┊106┊   ┊
-┊107┊   ┊  onPageChanged(page: number): void {
-┊108┊   ┊    this.curPage.next(page);
-┊109┊   ┊  }
-┊110┊   ┊
-┊111┊   ┊  changeSortOrder(nameOrder: string): void {
-┊112┊   ┊    this.nameOrder.next(parseInt(nameOrder));
-┊113┊   ┊  }
-┊114┊   ┊
-┊115┊   ┊  isOwner(party: Party): boolean {
-┊116┊   ┊    return this.user && this.user._id === party.owner;
-┊117┊   ┊  }
-┊118┊   ┊
-┊119┊   ┊  ngOnDestroy() {
-┊120┊   ┊    this.partiesSub.unsubscribe();
-┊121┊   ┊    this.optionsSub.unsubscribe();
-┊122┊   ┊    this.autorunSub.unsubscribe();
-┊123┊   ┊    this.imagesSubs.unsubscribe();
+┊   ┊ 13┊export class PartiesListComponent extends PartiesList {
+┊   ┊ 14┊  constructor(paginationService: PaginationService) {
+┊   ┊ 15┊    super(paginationService);
 ┊124┊ 16┊  }
 ┊125┊ 17┊}
```
[}]: #

Now let's create a basic view and layout for the mobile platform, be creating a new Component called `PartiesListMobile`, starting with the view:

[{]: <helper> (diff_step 23.21)
#### Step 23.21: Create a basic view of the mobile version

##### Added client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊<ion-header>
+┊ ┊2┊  <ion-navbar>
+┊ ┊3┊    <ion-title>Socially</ion-title>
+┊ ┊4┊  </ion-navbar>
+┊ ┊5┊</ion-header>
+┊ ┊6┊<ion-content>
+┊ ┊7┊  Parties!
+┊ ┊8┊</ion-content>
```
[}]: #

And it's Component, which is very similar to the web version, only it uses different template:

[{]: <helper> (diff_step 23.22)
#### Step 23.22: Create the mobile version of PartiesList component

##### Added client/imports/app/mobile/parties-list.component.mobile.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { PaginationService } from 'ng2-pagination';
+┊  ┊ 3┊import { PartiesList } from "../shared-components/parties-list.class";
+┊  ┊ 4┊
+┊  ┊ 5┊import template from './parties-list.component.mobile.html';
+┊  ┊ 6┊
+┊  ┊ 7┊@Component({
+┊  ┊ 8┊  selector: 'parties-list',
+┊  ┊ 9┊  template
+┊  ┊10┊})
+┊  ┊11┊export class PartiesListMobileComponent extends PartiesList {
+┊  ┊12┊  constructor(paginationService: PaginationService) {
+┊  ┊13┊    super(paginationService);
+┊  ┊14┊  }
+┊  ┊15┊}
```
[}]: #

Now let's add the mobile Component of the parties list to the index file:

[{]: <helper> (diff_step 23.23)
#### Step 23.23: Added PartiesListMobile component to the index file

##### Changed client/imports/app/mobile/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import {AppMobileComponent} from "./app.component.mobile";
+┊ ┊2┊import {PartiesListMobileComponent} from "./parties-list.component.mobile";
 ┊2┊3┊
 ┊3┊4┊export const MOBILE_DECLARATIONS = [
-┊4┊ ┊  AppMobileComponent
+┊ ┊5┊  AppMobileComponent,
+┊ ┊6┊  PartiesListMobileComponent
 ┊5┊7┊];🚫↵
```
[}]: #

And let's add the Component we just created as `rootPage` for our Ionic application:

[{]: <helper> (diff_step 23.24)
#### Step 23.24: Added the rootPage

##### Changed client/imports/app/mobile/app.component.mobile.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Component} from "@angular/core";
 ┊2┊2┊import template from "./app.component.mobile.html";
 ┊3┊3┊import {MenuController, Platform, App} from "ionic-angular";
+┊ ┊4┊import {PartiesListMobileComponent} from "./parties-list.component.mobile";
 ┊4┊5┊
 ┊5┊6┊if (Meteor.isCordova) {
 ┊6┊7┊  require("ionic-angular/css/ionic.css");
```
```diff
@@ -11,7 +12,9 @@
 ┊11┊12┊  template
 ┊12┊13┊})
 ┊13┊14┊export class AppMobileComponent {
-┊14┊  ┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊15┊  rootPage: any;
 ┊15┊16┊
+┊  ┊17┊  constructor(app: App, platform: Platform, menu: MenuController) {
+┊  ┊18┊    this.rootPage = PartiesListMobileComponent;
 ┊16┊19┊  }
 ┊17┊20┊}🚫↵
```
[}]: #

Now we just need declare this Component as `entryComponents` in the `NgModule` definition, and make sure we have all the required external modules in the `NgModule` that loaded for the mobile:

[{]: <helper> (diff_step 23.25)
#### Step 23.25: Update the module imports and entry point

##### Changed client/imports/app/app.module.ts
```diff
@@ -16,12 +16,14 @@
 ┊16┊16┊import { MOBILE_DECLARATIONS } from "./mobile/index";
 ┊17┊17┊import { AppMobileComponent } from "./mobile/app.component.mobile";
 ┊18┊18┊import { IonicModule, IonicApp } from "ionic-angular";
+┊  ┊19┊import { PartiesListMobileComponent } from "./mobile/parties-list.component.mobile";
 ┊19┊20┊
 ┊20┊21┊let moduleDefinition;
 ┊21┊22┊
 ┊22┊23┊if (Meteor.isCordova) {
 ┊23┊24┊  moduleDefinition = {
 ┊24┊25┊    imports: [
+┊  ┊26┊      Ng2PaginationModule,
 ┊25┊27┊      IonicModule.forRoot(AppMobileComponent)
 ┊26┊28┊    ],
 ┊27┊29┊    declarations: [
```
```diff
@@ -34,7 +36,7 @@
 ┊34┊36┊      IonicApp
 ┊35┊37┊    ],
 ┊36┊38┊    entryComponents: [
-┊37┊  ┊      AppMobileComponent
+┊  ┊39┊      PartiesListMobileComponent
 ┊38┊40┊    ]
 ┊39┊41┊  }
 ┊40┊42┊}
```
[}]: #

Now we want to add the actual view to the mobile Component, so let's do it:

[{]: <helper> (diff_step 23.26)
#### Step 23.26: Add name, description ad RSVPs to the view

##### Changed client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -4,5 +4,28 @@
 ┊ 4┊ 4┊  </ion-navbar>
 ┊ 5┊ 5┊</ion-header>
 ┊ 6┊ 6┊<ion-content>
-┊ 7┊  ┊  Parties!
+┊  ┊ 7┊  <ion-card *ngFor="let party of parties | async">
+┊  ┊ 8┊    <ion-card-content>
+┊  ┊ 9┊      <ion-card-title>
+┊  ┊10┊        {{party.name}}
+┊  ┊11┊      </ion-card-title>
+┊  ┊12┊      <p>
+┊  ┊13┊        {{party.description}}
+┊  ┊14┊      </p>
+┊  ┊15┊    </ion-card-content>
+┊  ┊16┊
+┊  ┊17┊    <ion-row no-padding>
+┊  ┊18┊      <ion-col text-right>
+┊  ┊19┊        <ion-badge>
+┊  ┊20┊          yes {{party | rsvp:'yes'}}
+┊  ┊21┊        </ion-badge>
+┊  ┊22┊        <ion-badge item-center dark>
+┊  ┊23┊          maybe {{party | rsvp:'maybe'}}
+┊  ┊24┊        </ion-badge>
+┊  ┊25┊        <ion-badge item-center danger>
+┊  ┊26┊          no {{party | rsvp:'no'}}
+┊  ┊27┊        </ion-badge>
+┊  ┊28┊      </ion-col>
+┊  ┊29┊    </ion-row>
+┊  ┊30┊  </ion-card>
 ┊ 8┊31┊</ion-content>
```
[}]: #

> We used `ion-card` which is an Ionic Component.

And in order to have the ability to load images in the mobile platform, we need to add some logic to the `displayMainImage` Pipe, because Meteor's absolute URL is not the same in mobile:

[{]: <helper> (diff_step 23.27)
#### Step 23.27: Fix an issuewith a absolute path of an image

##### Changed client/imports/app/shared/display-main-image.pipe.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Pipe, PipeTransform} from '@angular/core';
 ┊2┊2┊import { Images } from '../../../../both/collections/images.collection';
 ┊3┊3┊import { Party } from '../../../../both/models/party.model';
+┊ ┊4┊import { Meteor } from "meteor/meteor";
 ┊4┊5┊
 ┊5┊6┊@Pipe({
 ┊6┊7┊  name: 'displayMainImage'
```
```diff
@@ -17,7 +18,12 @@
 ┊17┊18┊    const found = Images.findOne(imageId);
 ┊18┊19┊
 ┊19┊20┊    if (found) {
-┊20┊  ┊      imageUrl = found.url;
+┊  ┊21┊      if (!Meteor.isCordova) {
+┊  ┊22┊        imageUrl = found.url;
+┊  ┊23┊      } else {
+┊  ┊24┊        const path = `ufs/${found.store}/${found._id}/${found.name}`;
+┊  ┊25┊        imageUrl = Meteor.absoluteUrl(path);
+┊  ┊26┊      }
 ┊21┊27┊    }
 ┊22┊28┊
 ┊23┊29┊    return imageUrl;
```
[}]: #

And let's add the image to the view:

[{]: <helper> (diff_step 23.28)
#### Step 23.28: Use the main image pipe

##### Changed client/imports/app/mobile/parties-list.component.mobile.html
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊</ion-header>
 ┊ 6┊ 6┊<ion-content>
 ┊ 7┊ 7┊  <ion-card *ngFor="let party of parties | async">
+┊  ┊ 8┊    <img *ngIf="party.images" [src]="party | displayMainImage">
 ┊ 8┊ 9┊    <ion-card-content>
 ┊ 9┊10┊      <ion-card-title>
 ┊10┊11┊        {{party.name}}
```
[}]: #

### Fixing fonts

As you probably notice, there are many warnings about missing fonts. We can easily fix it with the help of a package called [`mys:fonts`](https://github.com/jellyjs/meteor-fonts).

    $ meteor add mys:fonts

That plugin needs to know which font we want to use and where it should be available.

Configuration is pretty easy, you will catch it by just looking on an example:

[{]: <helper> (diff_step 23.30)
#### Step 23.30: Define fonts.json

##### Added fonts.json
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊{
+┊ ┊2┊  "map": {
+┊ ┊3┊    "node_modules/ionic-angular/fonts/roboto-medium.ttf": "fonts/roboto-medium.ttf",
+┊ ┊4┊    "node_modules/ionic-angular/fonts/roboto-regular.ttf": "fonts/roboto-regular.ttf",
+┊ ┊5┊    "node_modules/ionic-angular/fonts/roboto-medium.woff": "fonts/roboto-medium.woff",
+┊ ┊6┊    "node_modules/ionic-angular/fonts/roboto-regular.woff": "fonts/roboto-regular.woff"
+┊ ┊7┊  }
+┊ ┊8┊}🚫↵
```
[}]: #

Now `roboto-regular.ttf` is available under `http://localhost:3000/fonts/roboto-regular.ttf`.

And... You have an app that works with Ionic!

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view for both, web and mobile.

We also learned how to share component between platforms, and change the view only!

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step22.md) | [Next Step >](step24.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #