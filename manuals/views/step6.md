[{]: <region> (header)
# Step 6: Routing & Multiple Views
[}]: #
[{]: <region> (body)
In this step, you will learn:

-  how to create a layout template
-  how to build an app that has multiple views with the new Angular router.

The goal for this step is to add one more page to the app that shows the details of the selected party.

By default we have a list of parties shown on the page, but when a user clicks on a list item, the app should navigate to the new page and show selected party details.


## Parties List

Since we want to have multiple views in our app we have to move the current list of parties into the separate component.

Let's move the content of AppComponent in `app.component.ts` out into a `PartiesList` component.

Create a new file called `parties-list.component.ts` and put it in `client/imports/app/parties` directory.

[{]: <helper> (diff_step 6.1)
#### Step 6.1: Create PartiesList component

##### Added client/imports/app/parties/parties-list.component.ts
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊import { Observable } from 'rxjs/Observable';
+┊  ┊ 3┊
+┊  ┊ 4┊import { Parties } from '../../../../both/collections/parties.collection';
+┊  ┊ 5┊import { Party } from '../../../../both/models/party.model';
+┊  ┊ 6┊
+┊  ┊ 7┊import template from './parties-list.component.html';
+┊  ┊ 8┊
+┊  ┊ 9┊@Component({
+┊  ┊10┊  selector: 'parties-list',
+┊  ┊11┊  template
+┊  ┊12┊})
+┊  ┊13┊export class PartiesListComponent {
+┊  ┊14┊  parties: Observable<Party[]>;
+┊  ┊15┊
+┊  ┊16┊  constructor() {
+┊  ┊17┊    this.parties = Parties.find({}).zone();
+┊  ┊18┊  }
+┊  ┊19┊
+┊  ┊20┊  removeParty(party: Party): void {
+┊  ┊21┊    Parties.remove(party._id);
+┊  ┊22┊  }
+┊  ┊23┊}
```
[}]: #

There are few things we did in that step:

- Updated path of the module with `Parties` collection
- Changed the name of the template
- Used `parties-list` as the selector instead of `app`
- Renamed the class

Now we can copy `app.component.html` into the `parties` directory and rename it `parties-list.component.html`:

[{]: <helper> (diff_step 6.2)
#### Step 6.2: Copy contents of app.html to PartiesList template

##### Added client/imports/app/parties/parties-list.component.html
```diff
@@ -0,0 +1,12 @@
+┊  ┊ 1┊<div>
+┊  ┊ 2┊  <parties-form></parties-form>
+┊  ┊ 3┊
+┊  ┊ 4┊  <ul>
+┊  ┊ 5┊    <li *ngFor="let party of parties | async">
+┊  ┊ 6┊      {{party.name}}
+┊  ┊ 7┊      <p>{{party.description}}</p>
+┊  ┊ 8┊      <p>{{party.location}}</p>
+┊  ┊ 9┊      <button (click)="removeParty(party)">X</button>
+┊  ┊10┊    </li>
+┊  ┊11┊  </ul>
+┊  ┊12┊</div>🚫↵
```
[}]: #

Also, let's clean-up `app.component.ts` to prepare it for the next steps:

[{]: <helper> (diff_step 6.3)
#### Step 6.3: Clean up App component

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,8 +1,4 @@
 ┊1┊1┊import { Component } from '@angular/core';
-┊2┊ ┊import { Observable } from 'rxjs/Observable';
-┊3┊ ┊
-┊4┊ ┊import { Parties } from '../../../both/collections/parties.collection';
-┊5┊ ┊import { Party } from '../../../both/models/party.model';
 ┊6┊2┊
 ┊7┊3┊import template from './app.component.html';
 ┊8┊4┊
```
```diff
@@ -10,14 +6,4 @@
 ┊10┊ 6┊  selector: 'app',
 ┊11┊ 7┊  template
 ┊12┊ 8┊})
-┊13┊  ┊export class AppComponent {
-┊14┊  ┊  parties: Observable<Party[]>;
-┊15┊  ┊
-┊16┊  ┊  constructor() {
-┊17┊  ┊    this.parties = Parties.find({}).zone();
-┊18┊  ┊  }
-┊19┊  ┊
-┊20┊  ┊  removeParty(party: Party): void {
-┊21┊  ┊    Parties.remove(party._id);
-┊22┊  ┊  }
-┊23┊  ┊}
+┊  ┊ 9┊export class AppComponent {}
```
[}]: #

and the template for it, which is `app.component.html`:

> You will notice that the interface of your app has disappeared. But don't worry! It will come back later on.

[{]: <helper> (diff_step 6.4)
#### Step 6.4: Clean up App template

##### Changed client/imports/app/app.component.html
```diff
@@ -1,12 +1 @@
-┊ 1┊  ┊<div>
-┊ 2┊  ┊  <parties-form></parties-form>
-┊ 3┊  ┊  
-┊ 4┊  ┊  <ul>
-┊ 5┊  ┊    <li *ngFor="let party of parties | async">
-┊ 6┊  ┊      {{party.name}}
-┊ 7┊  ┊      <p>{{party.description}}</p>
-┊ 8┊  ┊      <p>{{party.location}}</p>
-┊ 9┊  ┊      <button (click)="removeParty(party)">X</button>
-┊10┊  ┊    </li>
-┊11┊  ┊  </ul>
-┊12┊  ┊</div>🚫↵
+┊  ┊ 1┊<div></div>🚫↵
```
[}]: #

And let's add the new Component to the index file:

[{]: <helper> (diff_step 6.5)
#### Step 6.5: Add PartiesList to parties declarations

##### Changed client/imports/app/parties/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import { PartiesFormComponent } from './parties-form.component';
+┊ ┊2┊import { PartiesListComponent } from './parties-list.component';
 ┊2┊3┊
 ┊3┊4┊export const PARTIES_DECLARATIONS = [
-┊4┊ ┊  PartiesFormComponent
+┊ ┊5┊  PartiesFormComponent,
+┊ ┊6┊  PartiesListComponent
 ┊5┊7┊];
```
[}]: #

# Routing


`@angular/router` is the package in charge of Routing in Angular 2, and we will learn how to use it now.

This package provides utils to define our routes, and get them as `NgModule` object we just include in our application.

**Defining routes**

We need to create an array of route definitions. The `Route` interface comes with help. This way we can be sure that properties of that object are correctly used.

The very basic two properties are `path` and `component`. The path is to define the url and the other one is to bind a component to it.

We will export our routes using `routes` variable.

Let's warp it in the `app.routes.ts` file, here's what it suppose to look like:

[{]: <helper> (diff_step 6.6)
#### Step 6.6: Define routes

##### Added client/imports/app/app.routes.ts
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊import { Route } from '@angular/router';
+┊ ┊2┊
+┊ ┊3┊import { PartiesListComponent } from './parties/parties-list.component';
+┊ ┊4┊
+┊ ┊5┊export const routes: Route[] = [
+┊ ┊6┊  { path: '', component: PartiesListComponent }
+┊ ┊7┊];
```
[}]: #

Now we can use `routes` in the `NgModule`, with the `RouteModule` provided by Angular 2:

[{]: <helper> (diff_step 6.7)
#### Step 6.7: Register RouterModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,15 +1,18 @@
 ┊ 1┊ 1┊import { NgModule } from '@angular/core';
 ┊ 2┊ 2┊import { BrowserModule } from '@angular/platform-browser';
 ┊ 3┊ 3┊import { FormsModule, ReactiveFormsModule } from '@angular/forms';
+┊  ┊ 4┊import { RouterModule } from '@angular/router';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊import { AppComponent } from './app.component';
+┊  ┊ 7┊import { routes } from './app.routes';
 ┊ 6┊ 8┊import { PARTIES_DECLARATIONS } from './parties';
 ┊ 7┊ 9┊
 ┊ 8┊10┊@NgModule({
 ┊ 9┊11┊  imports: [
 ┊10┊12┊    BrowserModule,
 ┊11┊13┊    FormsModule,
-┊12┊  ┊    ReactiveFormsModule
+┊  ┊14┊    ReactiveFormsModule,
+┊  ┊15┊    RouterModule.forRoot(routes)
 ┊13┊16┊  ],
 ┊14┊17┊  declarations: [
 ┊15┊18┊    AppComponent,
```
[}]: #

Our app still has to display the view somewhere. We'll use `routerOutlet` component to do this.

[{]: <helper> (diff_step 6.8)
#### Step 6.8: Implement routerOutlet

##### Changed client/imports/app/app.component.html
```diff
@@ -1 +1,3 @@
-┊1┊ ┊<div></div>🚫↵
+┊ ┊1┊<div>
+┊ ┊2┊  <router-outlet></router-outlet>
+┊ ┊3┊</div>🚫↵
```
[}]: #

Now, because we use a router that based on the browser path and URL - we need to tell Angular 2 router which path is the base path.

We already have it because we used the Angular 2 boilerplate, but if you are looking for it - you can find it in `client/index.html` file:

    <base href="/">

# Parties details

Let's add another view to the app: `PartyDetailsComponent`. Since it's not possible yet to get party details in this component, we are only going to make stubs.

When we're finished, clicking on a party in the list should redirect us to the PartyDetailsComponent for more information.

[{]: <helper> (diff_step 6.9)
#### Step 6.9: Add PartyDetails component

##### Added client/imports/app/parties/party-details.component.ts
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊import { Component } from '@angular/core';
+┊ ┊2┊
+┊ ┊3┊import template from './party-details.component.html';
+┊ ┊4┊
+┊ ┊5┊@Component({
+┊ ┊6┊  selector: 'party-details',
+┊ ┊7┊  template
+┊ ┊8┊})
+┊ ┊9┊export class PartyDetailsComponent {}
```
[}]: #

And add a simple template outline for the party details:

[{]: <helper> (diff_step 6.10)
#### Step 6.10: Create template for PartyDetails

##### Added client/imports/app/parties/party-details.component.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<header>
+┊ ┊2┊  <h2>PARTY_NAME</h2>
+┊ ┊3┊
+┊ ┊4┊  <p>PARTY_DESCRIPTION</p>
+┊ ┊5┊</header>🚫↵
```
[}]: #

And let's add the new Component to the index file:

[{]: <helper> (diff_step 6.11 client/imports/app/parties/index.ts)
#### Step 6.11: Add component to declarations

##### Changed client/imports/app/parties/index.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import { PartiesFormComponent } from './parties-form.component';
 ┊2┊2┊import { PartiesListComponent } from './parties-list.component';
+┊ ┊3┊import { PartyDetailsComponent } from './party-details.component';
 ┊3┊4┊
 ┊4┊5┊export const PARTIES_DECLARATIONS = [
 ┊5┊6┊  PartiesFormComponent,
-┊6┊ ┊  PartiesListComponent
+┊ ┊7┊  PartiesListComponent,
+┊ ┊8┊  PartyDetailsComponent
 ┊7┊9┊];
```
[}]: #

Now we can define the route:

[{]: <helper> (diff_step 6.11 client/imports/app/app.routes.ts)
#### Step 6.11: Add component to declarations

##### Changed client/imports/app/app.routes.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import { Route } from '@angular/router';
 ┊2┊2┊
 ┊3┊3┊import { PartiesListComponent } from './parties/parties-list.component';
+┊ ┊4┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊4┊5┊
 ┊5┊6┊export const routes: Route[] = [
-┊6┊ ┊  { path: '', component: PartiesListComponent }
+┊ ┊7┊  { path: '', component: PartiesListComponent },
+┊ ┊8┊  { path: 'party/:partyId', component: PartyDetailsComponent }
 ┊7┊9┊];
```
[}]: #

As you can see, we used `:partyId` inside of the path string. This way we define parameters. For example, `localhost:3000/party/12` will point to the PartyDetailsComponent with `12` as the value of the `partyId` parameter.

We still have to add a link that redirects to party details.

# RouterLink

Let's add links to the new router details view from the list of parties.

As we've already seen, each party link consists of two parts: the base `PartyDetailsComponent` URL and a party ID, represented by the `partyId` in the configuration. There is a special directive called `routerLink` that will help us to compose each URL.

Now we can wrap our party in a `routerLink` and pass in the _id as a parameter. Note that the id is auto-generated when an item is inserted into a Mongo Collection.

[{]: <helper> (diff_step 6.12)
#### Step 6.12: Use routerLink in PartiesList component

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊
 ┊4┊4┊  <ul>
 ┊5┊5┊    <li *ngFor="let party of parties | async">
-┊6┊ ┊      {{party.name}}
+┊ ┊6┊      <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊7┊7┊      <p>{{party.description}}</p>
 ┊8┊8┊      <p>{{party.location}}</p>
 ┊9┊9┊      <button (click)="removeParty(party)">X</button>
```
[}]: #

As you can see, we used an array. The first element is a path that we want to use and the next one is to provide a value of a parameter.

> You can provide more than one parameter by adding more elements into an array.

# Injecting Route Params

We've just added links to the `PartyDetails` view.

The next thing is to grab the `partyId` route parameter in order to load the correct party in the `PartyDetails` view.

In Angular 2, it's as simple as passing the `ActivatedRoute` argument to the `PartyDetails` constructor:

[{]: <helper> (diff_step 6.13)
#### Step 6.13: Subscribe to get the partyId

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,4 +1,7 @@
-┊1┊ ┊import { Component } from '@angular/core';
+┊ ┊1┊import { Component, OnInit } from '@angular/core';
+┊ ┊2┊import { ActivatedRoute } from '@angular/router';
+┊ ┊3┊
+┊ ┊4┊import 'rxjs/add/operator/map';
 ┊2┊5┊
 ┊3┊6┊import template from './party-details.component.html';
 ┊4┊7┊
```
```diff
@@ -6,4 +9,16 @@
 ┊ 6┊ 9┊  selector: 'party-details',
 ┊ 7┊10┊  template
 ┊ 8┊11┊})
-┊ 9┊  ┊export class PartyDetailsComponent {}
+┊  ┊12┊export class PartyDetailsComponent implements OnInit {
+┊  ┊13┊  partyId: string;
+┊  ┊14┊
+┊  ┊15┊  constructor(
+┊  ┊16┊    private route: ActivatedRoute
+┊  ┊17┊  ) {}
+┊  ┊18┊
+┊  ┊19┊  ngOnInit() {
+┊  ┊20┊    this.route.params
+┊  ┊21┊      .map(params => params['partyId'])
+┊  ┊22┊      .subscribe(partyId => this.partyId = partyId);
+┊  ┊23┊  }
+┊  ┊24┊}
```
[}]: #

> We used another RxJS feature called `map` - which transform the stream of data into another object - in this case, we want to get the `partyId` from the `params`, then we subscribe to the return value of this function - and the subscription will be called only with the `partyId` that we need.

> As you might noticed, Angular 2 uses RxJS internally and exposes a lot of APIs using RxJS Observable!

Dependency injection is employed heavily here by Angular 2 to do all the work behind the scenes.

TypeScript first compiles this class with the class metadata that says what argument types this class expects in the constructor (i.e. `ActivatedRoute`),
so Angular 2 knows what types to inject if asked to create an instance of this class.

Then, when you click on a party details link, the `router-outlet` directive will create a `ActivatedRoute` provider that provides
parameters for the current URL. Right after that moment if a `PartyDetails` instance is created by means of the dependency injection API, it's created with `ActivatedRoute` injected and equalled to the current URL inside the constructor.

If you want to read more about dependency injection in Angular 2, you can find an extensive overview in this [article](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html).
If you are curious about class metadata read more about it [here](http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html).

In order to avoid memory leaks and performance issues, we need to make sure that every time we use `subscribe` in our Component - we also use `unsubscribe` when the data is no longer interesting.

In order to do so, we will use Angular 2 interface called `OnDestroy` and implement `ngOnDestroy` - which called when our Component is no longer in the view and removed from the DOM.

So let's implement this:

[{]: <helper> (diff_step 6.14)
#### Step 6.14: Unsubscribe when component is being destroyed

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,5 +1,6 @@
-┊1┊ ┊import { Component, OnInit } from '@angular/core';
+┊ ┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { ActivatedRoute } from '@angular/router';
+┊ ┊3┊import { Subscription } from 'rxjs/Subscription';
 ┊3┊4┊
 ┊4┊5┊import 'rxjs/add/operator/map';
 ┊5┊6┊
```
```diff
@@ -9,16 +10,21 @@
 ┊ 9┊10┊  selector: 'party-details',
 ┊10┊11┊  template
 ┊11┊12┊})
-┊12┊  ┊export class PartyDetailsComponent implements OnInit {
+┊  ┊13┊export class PartyDetailsComponent implements OnInit, OnDestroy {
 ┊13┊14┊  partyId: string;
+┊  ┊15┊  paramsSub: Subscription;
 ┊14┊16┊
 ┊15┊17┊  constructor(
 ┊16┊18┊    private route: ActivatedRoute
 ┊17┊19┊  ) {}
 ┊18┊20┊
 ┊19┊21┊  ngOnInit() {
-┊20┊  ┊    this.route.params
+┊  ┊22┊    this.paramsSub = this.route.params
 ┊21┊23┊      .map(params => params['partyId'])
 ┊22┊24┊      .subscribe(partyId => this.partyId = partyId);
 ┊23┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  ngOnDestroy() {
+┊  ┊28┊    this.paramsSub.unsubscribe();
+┊  ┊29┊  }
 ┊24┊30┊}
```
[}]: #

Now, we need to get the actual `Party` object with the ID we got from the Router, so let's use the `Parties` collection to get it:

[{]: <helper> (diff_step 6.15)
#### Step 6.15: Load party details

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,9 +1,12 @@
 ┊ 1┊ 1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊ 2┊ 2┊import { ActivatedRoute } from '@angular/router';
-┊ 3┊  ┊import { Subscription } from 'rxjs/Subscription';
+┊  ┊ 3┊import { Subscription } from 'rxjs/Subscription'; 
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import 'rxjs/add/operator/map';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import { Parties } from '../../../../both/collections/parties.collection';
+┊  ┊ 8┊import { Party } from '../../../../both/models/party.model';
+┊  ┊ 9┊
 ┊ 7┊10┊import template from './party-details.component.html';
 ┊ 8┊11┊
 ┊ 9┊12┊@Component({
```
```diff
@@ -13,6 +16,7 @@
 ┊13┊16┊export class PartyDetailsComponent implements OnInit, OnDestroy {
 ┊14┊17┊  partyId: string;
 ┊15┊18┊  paramsSub: Subscription;
+┊  ┊19┊  party: Party;
 ┊16┊20┊
 ┊17┊21┊  constructor(
 ┊18┊22┊    private route: ActivatedRoute
```
```diff
@@ -21,7 +25,11 @@
 ┊21┊25┊  ngOnInit() {
 ┊22┊26┊    this.paramsSub = this.route.params
 ┊23┊27┊      .map(params => params['partyId'])
-┊24┊  ┊      .subscribe(partyId => this.partyId = partyId);
+┊  ┊28┊      .subscribe(partyId => {
+┊  ┊29┊        this.partyId = partyId
+┊  ┊30┊        
+┊  ┊31┊        this.party = Parties.findOne(this.partyId);
+┊  ┊32┊      });
 ┊25┊33┊  }
 ┊26┊34┊
 ┊27┊35┊  ngOnDestroy() {
```
[}]: #

> `findOne` return the actual object instead of returning Observable or Cursor.

In our next step we will display the party details inside our view!

# Challenge

Add a link back to the `PartiesList` component from `PartyDetails`.

# Summary

Let's list what we've accomplished in this step:

- split our app into two main views
- configured routing to use these views and created a layout template
- learned briefly how dependency injection works in Angular 2
- injected route parameters and loaded party details with the ID parameter

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step5.md) | [Next Step >](step7.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #