[{]: <region> (header)
# Step 19: angular-material and custom Angular auth forms
[}]: #
[{]: <region> (body)
In this chapter we will add angular2-material to our project, and update some style and layout in the project.

Angular2-material documentation of each component can be found [here](https://github.com/angular/material2/tree/master/src/components).

# Removing Bootstrap 4

First, let's remove our previous framework (Bootstrap) by running:

    $ meteor npm uninstall --save bootstrap

And let's remove the import from the `main.sass` file:

[{]: <helper> (diff_step 19.2)
#### Step 19.2: Remove bootstrap scss

##### Changed client/main.scss
```diff
@@ -1,4 +1,3 @@
-┊1┊ ┊@import "../node_modules/bootstrap/scss/bootstrap.scss";
 ┊2┊1┊@import "./imports/app/colors.scss";
 ┊3┊2┊
 ┊4┊3┊html, body {
```
[}]: #

# Adding angular2-material

Now we need to add angular2-material to our project - so let's do that.

Run the following command in your Terminal:

    $ meteor npm install @angular/material@2.0.0-alpha.9

Now let's load the module into our `NgModule`:

[{]: <helper> (diff_step 19.4)
#### Step 19.4: Imported the angular2-material modules

##### Changed client/imports/app/app.module.ts
```diff
@@ -10,6 +10,7 @@
 ┊10┊10┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊11┊11┊import { PARTIES_DECLARATIONS } from './parties';
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
+┊  ┊13┊import { MaterialModule } from "@angular/material";
 ┊13┊14┊
 ┊14┊15┊@NgModule({
 ┊15┊16┊  imports: [
```
```diff
@@ -21,7 +22,8 @@
 ┊21┊22┊    Ng2PaginationModule,
 ┊22┊23┊    AgmCoreModule.forRoot({
 ┊23┊24┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
-┊24┊  ┊    })
+┊  ┊25┊    }),
+┊  ┊26┊    MaterialModule.forRoot()
 ┊25┊27┊  ],
 ┊26┊28┊  declarations: [
 ┊27┊29┊    AppComponent,
```
[}]: #

Like we did in the previous chapter - let's take care of the navigation bar first.

We will use directives and components from Angular2-Material - such as `md-toolbar`.

Let's use it in the app component's template:

[{]: <helper> (diff_step 19.5)
#### Step 19.5: Change the nav bar and the layout

##### Changed client/imports/app/app.component.html
```diff
@@ -1,7 +1,6 @@
-┊1┊ ┊<nav class="navbar navbar-light bg-faded">
-┊2┊ ┊  <a class="navbar-brand" href="#">Socially</a>
-┊3┊ ┊  <login-buttons class="pull-right"></login-buttons>
-┊4┊ ┊</nav>
-┊5┊ ┊<div class="container-fluid">
-┊6┊ ┊  <router-outlet></router-outlet>
-┊7┊ ┊</div>🚫↵
+┊ ┊1┊<md-toolbar color="primary">
+┊ ┊2┊  <a routerLink="/" class="toolbar-title">Socially2</a>
+┊ ┊3┊  <span class="fill-remaining-space"></span>
+┊ ┊4┊  <login-buttons></login-buttons>
+┊ ┊5┊</md-toolbar>
+┊ ┊6┊<router-outlet></router-outlet>🚫↵
```
[}]: #

And let's create a stylesheet file for the `AppComponent`:

[{]: <helper> (diff_step 19.6)
#### Step 19.6: Added app component style file

##### Added client/imports/app/app.component.scss
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊.toolbar-title {
+┊ ┊2┊  text-decoration: none;
+┊ ┊3┊  color: white;
+┊ ┊4┊}
+┊ ┊5┊
+┊ ┊6┊md-toolbar {
+┊ ┊7┊  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
+┊ ┊8┊}🚫↵
```
[}]: #

And import it into our Component:

[{]: <helper> (diff_step 19.7)
#### Step 19.7: Import app component style

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,9 +1,11 @@
 ┊ 1┊ 1┊import { Component } from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './app.component.html';
+┊  ┊ 4┊import style from './app.component.scss';
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊@Component({
 ┊ 6┊ 7┊  selector: 'app',
-┊ 7┊  ┊  template
+┊  ┊ 8┊  template,
+┊  ┊ 9┊  styles: [ style ]
 ┊ 8┊10┊})
 ┊ 9┊11┊export class AppComponent {}
```
[}]: #

And let's add `.fill-remaining-space` CSS class we used, and let's create a Angular 2 Material theme with the colors we like (full documentation about themes is [here](https://github.com/angular/material2/blob/master/docs/theming.md))

[{]: <helper> (diff_step 19.8)
#### Step 19.8: Added CSS and material theme definition

##### Changed client/main.scss
```diff
@@ -1,32 +1,24 @@
-┊ 1┊  ┊@import "./imports/app/colors.scss";
+┊  ┊ 1┊@import '../node_modules/@angular/material/core/theming/all-theme';
 ┊ 2┊ 2┊
-┊ 3┊  ┊html, body {
-┊ 4┊  ┊  height: 100%;
+┊  ┊ 3┊@include md-core();
+┊  ┊ 4┊$app-primary: md-palette($md-light-blue, 500, 100, 700);
+┊  ┊ 5┊$app-accent:  md-palette($md-pink, A200, A100, A400);
+┊  ┊ 6┊$app-warn:    md-palette($md-red);
+┊  ┊ 7┊$app-theme: md-light-theme($app-primary, $app-accent, $app-warn);
+┊  ┊ 8┊@include angular-material-theme($app-theme);
+┊  ┊ 9┊
+┊  ┊10┊.fill-remaining-space {
+┊  ┊11┊  flex: 1 1 auto;
 ┊ 5┊12┊}
 ┊ 6┊13┊
 ┊ 7┊14┊body {
 ┊ 8┊15┊  background-color: #f8f8f8;
 ┊ 9┊16┊  font-family: 'Muli', sans-serif;
+┊  ┊17┊  padding: 0;
+┊  ┊18┊  margin: 0;
 ┊10┊19┊}
 ┊11┊20┊
 ┊12┊21┊.sebm-google-map-container {
 ┊13┊22┊  width: 450px;
 ┊14┊23┊  height: 450px;
 ┊15┊24┊}
-┊16┊  ┊
-┊17┊  ┊.navbar {
-┊18┊  ┊  background-color: #ffffff;
-┊19┊  ┊  border-bottom: #eee 1px solid;
-┊20┊  ┊  color: $color3;
-┊21┊  ┊  font-family: 'Muli', sans-serif;
-┊22┊  ┊  a {
-┊23┊  ┊    color: $color3;
-┊24┊  ┊    text-decoration: none !important;
-┊25┊  ┊  }
-┊26┊  ┊
-┊27┊  ┊  .navbar-right-container {
-┊28┊  ┊    position: absolute;
-┊29┊  ┊    top: 17px;
-┊30┊  ┊    right: 17px;
-┊31┊  ┊  }
-┊32┊  ┊}🚫↵
```
[}]: #

# PartiesForm component

Let's replace the `label` and the `input` with simply the `md-input` and `md-checkbox` and make the `button` look material:

[{]: <helper> (diff_step 19.9)
#### Step 19.9: Update the view of the parties form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,21 +1,42 @@
-┊ 1┊  ┊<form [formGroup]="addForm" (ngSubmit)="addParty()" class="form-inline">
-┊ 2┊  ┊  <fieldset class="form-group">
-┊ 3┊  ┊    <label for="partyName">Party name</label>
-┊ 4┊  ┊    <input id="partyName" class="form-control" type="text" formControlName="name" placeholder="Party name" />
-┊ 5┊  ┊
-┊ 6┊  ┊    <label for="description">Description</label>
-┊ 7┊  ┊    <input id="description" class="form-control" type="text" formControlName="description" placeholder="Description">
-┊ 8┊  ┊
-┊ 9┊  ┊    <label for="location_name">Location</label>
-┊10┊  ┊    <input id="location_name" class="form-control" type="text" formControlName="location" placeholder="Location name">
-┊11┊  ┊
-┊12┊  ┊    <div class="checkbox">
-┊13┊  ┊      <label>
-┊14┊  ┊        <input type="checkbox" formControlName="public">
-┊15┊  ┊        Public
-┊16┊  ┊      </label>
+┊  ┊ 1┊<div class="form-container">
+┊  ┊ 2┊  <div class="container-background">
+┊  ┊ 3┊    <div class="form-content">
+┊  ┊ 4┊      <div class="form-center">
+┊  ┊ 5┊        <h1>Your party is missing?</h1>
+┊  ┊ 6┊        <h2>Add it now! ></h2>
+┊  ┊ 7┊      </div>
+┊  ┊ 8┊      <div class="form-center">
+┊  ┊ 9┊        <form *ngIf="user" [formGroup]="addForm" (ngSubmit)="addParty()">
+┊  ┊10┊          <div style="display: table-row">
+┊  ┊11┊            <div class="form-inputs">
+┊  ┊12┊              <md-input dividerColor="accent" formControlName="name" placeholder="Party name"></md-input>
+┊  ┊13┊              <br/>
+┊  ┊14┊              <md-input dividerColor="accent" formControlName="description" placeholder="Description"></md-input>
+┊  ┊15┊              <br/>
+┊  ┊16┊              <md-input dividerColor="accent" formControlName="location" placeholder="Location name"></md-input>
+┊  ┊17┊              <br/>
+┊  ┊18┊              <md-checkbox formControlName="public">Public party?</md-checkbox>
+┊  ┊19┊              <br/><br/>
+┊  ┊20┊              <button color="accent" md-raised-button type="submit">Add my party!</button>
+┊  ┊21┊            </div>
+┊  ┊22┊            <div class="form-extras">
+┊  ┊23┊              <sebm-google-map class="new-party-map"
+┊  ┊24┊                               [latitude]="newPartyPosition.lat"
+┊  ┊25┊                               [longitude]="newPartyPosition.lng"
+┊  ┊26┊                               [zoom]="8"
+┊  ┊27┊                               (mapClick)="mapClicked($event)">
+┊  ┊28┊                <sebm-google-map-marker
+┊  ┊29┊                  [latitude]="newPartyPosition.lat"
+┊  ┊30┊                  [longitude]="newPartyPosition.lng">
+┊  ┊31┊                </sebm-google-map-marker>
+┊  ┊32┊              </sebm-google-map>
+┊  ┊33┊            </div>
+┊  ┊34┊          </div>
+┊  ┊35┊        </form>
+┊  ┊36┊        <div *ngIf="!user">
+┊  ┊37┊          Please login in order to create new parties!
+┊  ┊38┊        </div>
+┊  ┊39┊      </div>
 ┊17┊40┊    </div>
-┊18┊  ┊
-┊19┊  ┊    <button type="submit" class="btn btn-primary">Add</button>
-┊20┊  ┊  </fieldset>
-┊21┊  ┊</form>
+┊  ┊41┊  </div>
+┊  ┊42┊</div>🚫↵
```
[}]: #

We use the `mdInput` component which is a wrapper for regular HTML input with style and cool layout.

Now let's add CSS styles:

[{]: <helper> (diff_step 19.10)
#### Step 19.10: Added styles for parties form

##### Added client/imports/app/parties/parties-form.component.scss
```diff
@@ -0,0 +1,54 @@
+┊  ┊ 1┊.form-container {
+┊  ┊ 2┊  position: relative;
+┊  ┊ 3┊  display: inline-block;
+┊  ┊ 4┊  overflow-y: auto;
+┊  ┊ 5┊  overflow-x: hidden;
+┊  ┊ 6┊  flex-grow: 1;
+┊  ┊ 7┊  z-index: 1;
+┊  ┊ 8┊  width: 100%;
+┊  ┊ 9┊  color: white;
+┊  ┊10┊
+┊  ┊11┊  .container-background {
+┊  ┊12┊    background: linear-gradient(rgb(0,121,107),rgb(0,150,136));
+┊  ┊13┊    color: #fff;
+┊  ┊14┊
+┊  ┊15┊    .form-content {
+┊  ┊16┊      background: #0277bd;
+┊  ┊17┊      width: 100%;
+┊  ┊18┊      padding: 0 !important;
+┊  ┊19┊      align-items: center;
+┊  ┊20┊      display: flex;
+┊  ┊21┊      flex-flow: row wrap;
+┊  ┊22┊      margin: 0 auto;
+┊  ┊23┊
+┊  ┊24┊      form {
+┊  ┊25┊        width: 100%;
+┊  ┊26┊        display: table;
+┊  ┊27┊      }
+┊  ┊28┊
+┊  ┊29┊      .form-inputs {
+┊  ┊30┊        display: table-cell;
+┊  ┊31┊        width: 60%;
+┊  ┊32┊        vertical-align: top;
+┊  ┊33┊        text-align: center;
+┊  ┊34┊        margin-top: 20px;
+┊  ┊35┊      }
+┊  ┊36┊
+┊  ┊37┊      .form-extras {
+┊  ┊38┊        display: table-cell;
+┊  ┊39┊        width: 40%;
+┊  ┊40┊        vertical-align: top;
+┊  ┊41┊
+┊  ┊42┊        .new-party-map {
+┊  ┊43┊          width: 100% !important;
+┊  ┊44┊          height: 300px !important;
+┊  ┊45┊        }
+┊  ┊46┊      }
+┊  ┊47┊
+┊  ┊48┊      .form-center {
+┊  ┊49┊        width: 50%;
+┊  ┊50┊        text-align: center;
+┊  ┊51┊      }
+┊  ┊52┊    }
+┊  ┊53┊  }
+┊  ┊54┊}🚫↵
```
[}]: #

Now we need to make some changes in our Component's code - we will inject the user (using `InjectUser`), import the new stylesheet and add the ability to set the new party location using a Google map Component:

[{]: <helper> (diff_step 19.11)
#### Step 19.11: Inject user and import styles into the form

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -1,17 +1,19 @@
 ┊ 1┊ 1┊import { Component, OnInit } from '@angular/core';
 ┊ 2┊ 2┊import { FormGroup, FormBuilder, Validators } from '@angular/forms';
-┊ 3┊  ┊import { Meteor } from 'meteor/meteor';
-┊ 4┊  ┊
 ┊ 5┊ 3┊import { Parties } from '../../../../both/collections/parties.collection';
-┊ 6┊  ┊
+┊  ┊ 4┊import { InjectUser } from "angular2-meteor-accounts-ui";
 ┊ 7┊ 5┊import template from './parties-form.component.html';
+┊  ┊ 6┊import style from './parties-form.component.scss';
 ┊ 8┊ 7┊
 ┊ 9┊ 8┊@Component({
 ┊10┊ 9┊  selector: 'parties-form',
-┊11┊  ┊  template
+┊  ┊10┊  template,
+┊  ┊11┊  styles: [ style ]
 ┊12┊12┊})
+┊  ┊13┊@InjectUser("user")
 ┊13┊14┊export class PartiesFormComponent implements OnInit {
 ┊14┊15┊  addForm: FormGroup;
+┊  ┊16┊  newPartyPosition: {lat:number, lng: number} = {lat: 37.4292, lng: -122.1381};
 ┊15┊17┊
 ┊16┊18┊  constructor(
 ┊17┊19┊    private formBuilder: FormBuilder
```
```diff
@@ -26,6 +28,10 @@
 ┊26┊28┊    });
 ┊27┊29┊  }
 ┊28┊30┊
+┊  ┊31┊  mapClicked($event) {
+┊  ┊32┊    this.newPartyPosition = $event.coords;
+┊  ┊33┊  }
+┊  ┊34┊
 ┊29┊35┊  addParty(): void {
 ┊30┊36┊    if (!Meteor.userId()) {
 ┊31┊37┊      alert('Please log in to add a party');
```
```diff
@@ -37,7 +43,9 @@
 ┊37┊43┊        name: this.addForm.value.name,
 ┊38┊44┊        description: this.addForm.value.description,
 ┊39┊45┊        location: {
-┊40┊  ┊          name: this.addForm.value.location
+┊  ┊46┊          name: this.addForm.value.location,
+┊  ┊47┊          lat: this.newPartyPosition.lat,
+┊  ┊48┊          lng: this.newPartyPosition.lng
 ┊41┊49┊        },
 ┊42┊50┊        public: this.addForm.value.public,
 ┊43┊51┊        owner: Meteor.userId()
```
[}]: #

# PartiesList component

PartiesForm component is done, so we can move one level higher in the component's tree. Time for the list of parties:

[{]: <helper> (diff_step 19.12)
#### Step 19.12: Updated the layout of the parties list

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,100 +1,66 @@
-┊  1┊   ┊<div class="row">
-┊  2┊   ┊  <div class="col-md-12">
-┊  3┊   ┊    <div class="jumbotron">
-┊  4┊   ┊      <h3>Create a new party!</h3>
-┊  5┊   ┊      <parties-form [hidden]="!user"></parties-form>
-┊  6┊   ┊      <div [hidden]="user">You need to login to create new parties!</div>
-┊  7┊   ┊    </div>
-┊  8┊   ┊  </div>
-┊  9┊   ┊</div>
-┊ 10┊   ┊<div class="row ma-filters">
-┊ 11┊   ┊  <div class="col-md-6">
-┊ 12┊   ┊    <h3>All Parties:</h3>
-┊ 13┊   ┊    <form class="form-inline">
-┊ 14┊   ┊      <input type="text" class="form-control" #searchtext placeholder="Search by Location">
-┊ 15┊   ┊      <button type="button" class="btn btn-primary" (click)="search(searchtext.value)">Search</button>
-┊ 16┊   ┊      Sort by name: <select class="form-control" #sort (change)="changeSortOrder(sort.value)">
-┊ 17┊   ┊      <option value="1" selected>Ascending</option>
-┊ 18┊   ┊      <option value="-1">Descending</option>
-┊ 19┊   ┊    </select>
-┊ 20┊   ┊    </form>
-┊ 21┊   ┊  </div>
-┊ 22┊   ┊</div>
-┊ 23┊   ┊<div class="row">
-┊ 24┊   ┊  <div class="col-md-6">
-┊ 25┊   ┊    <ul class="list-group">
-┊ 26┊   ┊      <li class="list-group-item">
-┊ 27┊   ┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
-┊ 28┊   ┊      </li>
-┊ 29┊   ┊      <li *ngFor="let party of parties | async"
-┊ 30┊   ┊          class="list-group-item ma-party-item">
-┊ 31┊   ┊        <div class="row">
-┊ 32┊   ┊          <div class="col-sm-8">
-┊ 33┊   ┊            <h2 class="ma-party-name">
-┊ 34┊   ┊              <a [routerLink]="['/party', party._id]">{{party.name}}</a>
-┊ 35┊   ┊            </h2>
-┊ 36┊   ┊            @ {{party.location.name}}
-┊ 37┊   ┊            <p class="ma-party-description">
-┊ 38┊   ┊              {{party.description}}
-┊ 39┊   ┊            </p>
-┊ 40┊   ┊          </div>
-┊ 41┊   ┊          <div class="col-sm-4">
-┊ 42┊   ┊            <button class="btn btn-danger pull-right" [hidden]="!isOwner(party)" (click)="removeParty(party)"><i
-┊ 43┊   ┊              class="fa fa-times"></i></button>
-┊ 44┊   ┊          </div>
+┊   ┊  1┊<parties-form></parties-form>
+┊   ┊  2┊
+┊   ┊  3┊<div class="parties-list-container">
+┊   ┊  4┊  <div class="parties-list">
+┊   ┊  5┊    <md-card class="filter-card">
+┊   ┊  6┊      <h3>Filter Parties</h3>
+┊   ┊  7┊      <form>
+┊   ┊  8┊        By Location: <md-input dividerColor="primary" type="text" #searchtext placeholder="Enter Location"></md-input>
+┊   ┊  9┊        <button md-button (click)="search(searchtext.value)">Find</button>
+┊   ┊ 10┊        <br />
+┊   ┊ 11┊        Sort by name:
+┊   ┊ 12┊        <select class="form-control" #sort (change)="changeSortOrder(sort.value)">
+┊   ┊ 13┊          <option value="1" selected>Ascending</option>
+┊   ┊ 14┊          <option value="-1">Descending</option>
+┊   ┊ 15┊        </select>
+┊   ┊ 16┊      </form>
+┊   ┊ 17┊    </md-card>
+┊   ┊ 18┊
+┊   ┊ 19┊    <pagination-controls class="pagination" (pageChange)="onPageChanged($event)"></pagination-controls>
+┊   ┊ 20┊
+┊   ┊ 21┊    <md-card *ngFor="let party of parties | async" class="party-card">
+┊   ┊ 22┊      <h2 class="party-name">
+┊   ┊ 23┊        <a [routerLink]="['/party', party._id]">{{party.name}}</a>
+┊   ┊ 24┊      </h2>
+┊   ┊ 25┊      @ {{party.location.name}}
+┊   ┊ 26┊      <br />
+┊   ┊ 27┊      {{party.description}}
+┊   ┊ 28┊
+┊   ┊ 29┊      <button class="remove-party" md-icon-button *ngIf="isOwner(party)" (click)="removeParty(party)">
+┊   ┊ 30┊        <md-icon class="md-24">X</md-icon>
+┊   ┊ 31┊      </button>
+┊   ┊ 32┊
+┊   ┊ 33┊      <div class="rsvp-container">
+┊   ┊ 34┊        <div class="rsvps-sum">
+┊   ┊ 35┊          <div class="rsvps-amount">{{party | rsvp:'yes'}}</div>
+┊   ┊ 36┊          <div class="rsvps-title">Yes</div>
+┊   ┊ 37┊        </div>
+┊   ┊ 38┊        <div class="rsvps-sum">
+┊   ┊ 39┊          <div class="rsvps-amount">{{party | rsvp:'maybe'}}</div>
+┊   ┊ 40┊          <div class="rsvps-title">Maybe</div>
 ┊ 45┊ 41┊        </div>
-┊ 46┊   ┊        <div class="row ma-party-item-bottom">
-┊ 47┊   ┊          <div class="col-sm-4">
-┊ 48┊   ┊            <div class="ma-rsvp-sum">
-┊ 49┊   ┊              <div class="ma-rsvp-amount">
-┊ 50┊   ┊                <div class="ma-amount">
-┊ 51┊   ┊                  {{party | rsvp:'yes'}}
-┊ 52┊   ┊                </div>
-┊ 53┊   ┊                <div class="ma-rsvp-title">
-┊ 54┊   ┊                  YES
-┊ 55┊   ┊                </div>
-┊ 56┊   ┊              </div>
-┊ 57┊   ┊              <div class="ma-rsvp-amount">
-┊ 58┊   ┊                <div class="ma-amount">
-┊ 59┊   ┊                  {{party | rsvp:'maybe'}}
-┊ 60┊   ┊                </div>
-┊ 61┊   ┊                <div class="ma-rsvp-title">
-┊ 62┊   ┊                  MAYBE
-┊ 63┊   ┊                </div>
-┊ 64┊   ┊              </div>
-┊ 65┊   ┊              <div class="ma-rsvp-amount">
-┊ 66┊   ┊                <div class="ma-amount">
-┊ 67┊   ┊                  {{party | rsvp:'no'}}
-┊ 68┊   ┊                </div>
-┊ 69┊   ┊                <div class="ma-rsvp-title">
-┊ 70┊   ┊                  NO
-┊ 71┊   ┊                </div>
-┊ 72┊   ┊              </div>
-┊ 73┊   ┊            </div>
-┊ 74┊   ┊          </div>
+┊   ┊ 42┊        <div class="rsvps-sum">
+┊   ┊ 43┊          <div class="rsvps-amount">{{party | rsvp:'no'}}</div>
+┊   ┊ 44┊          <div class="rsvps-title">No</div>
 ┊ 75┊ 45┊        </div>
-┊ 76┊   ┊      </li>
-┊ 77┊   ┊      <li class="list-group-item">
-┊ 78┊   ┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
-┊ 79┊   ┊      </li>
-┊ 80┊   ┊    </ul>
+┊   ┊ 46┊      </div>
+┊   ┊ 47┊    </md-card>
+┊   ┊ 48┊
+┊   ┊ 49┊    <pagination-controls class="pagination" (pageChange)="onPageChanged($event)"></pagination-controls>
 ┊ 81┊ 50┊  </div>
-┊ 82┊   ┊  <div class="col-md-6">
-┊ 83┊   ┊    <ul class="list-group">
-┊ 84┊   ┊      <li class="list-group-item">
-┊ 85┊   ┊        <sebm-google-map
-┊ 86┊   ┊          [latitude]="0"
-┊ 87┊   ┊          [longitude]="0"
-┊ 88┊   ┊          [zoom]="1">
-┊ 89┊   ┊          <div *ngFor="let party of parties | async">
-┊ 90┊   ┊            <sebm-google-map-marker
-┊ 91┊   ┊              *ngIf="party.location.lat"
-┊ 92┊   ┊              [latitude]="party.location.lat"
-┊ 93┊   ┊              [longitude]="party.location.lng">
-┊ 94┊   ┊            </sebm-google-map-marker>
-┊ 95┊   ┊          </div>
-┊ 96┊   ┊        </sebm-google-map>
-┊ 97┊   ┊      </li>
-┊ 98┊   ┊    </ul>
+┊   ┊ 51┊  <div class="parties-map">
+┊   ┊ 52┊    <sebm-google-map
+┊   ┊ 53┊      [latitude]="0"
+┊   ┊ 54┊      [longitude]="0"
+┊   ┊ 55┊      [zoom]="1"
+┊   ┊ 56┊      class="google-map">
+┊   ┊ 57┊      <div *ngFor="let party of parties | async">
+┊   ┊ 58┊      <sebm-google-map-marker
+┊   ┊ 59┊      *ngIf="party.location.lat"
+┊   ┊ 60┊      [latitude]="party.location.lat"
+┊   ┊ 61┊      [longitude]="party.location.lng">
+┊   ┊ 62┊      </sebm-google-map-marker>
+┊   ┊ 63┊      </div>
+┊   ┊ 64┊    </sebm-google-map>
 ┊ 99┊ 65┊  </div>
 ┊100┊ 66┊</div>🚫↵
```
[}]: #

To make it all look so much better, let's add couple of rules to css:

[{]: <helper> (diff_step 19.13)
#### Step 19.13: Updated the styles of the parties list

##### Changed client/imports/app/parties/parties-list.component.scss
```diff
@@ -1,127 +1,71 @@
-┊  1┊   ┊@import "../colors";
+┊   ┊  1┊.parties-list-container {
+┊   ┊  2┊  align-items: center;
+┊   ┊  3┊  display: flex;
+┊   ┊  4┊  flex-flow: row wrap;
+┊   ┊  5┊  margin: 0 auto;
+┊   ┊  6┊  width: 100%;
+┊   ┊  7┊  display: table;
 ┊  2┊  8┊
-┊  3┊   ┊.ma-add-button-container {
-┊  4┊   ┊  button.btn {
-┊  5┊   ┊    background: $color3;
-┊  6┊   ┊    float: right;
-┊  7┊   ┊    margin-right: 5px;
-┊  8┊   ┊    outline: none;
-┊  9┊   ┊    i {
-┊ 10┊   ┊      color: $color5;
-┊ 11┊   ┊    }
-┊ 12┊   ┊  }
-┊ 13┊   ┊}
-┊ 14┊   ┊
-┊ 15┊   ┊.ma-parties-col {
-┊ 16┊   ┊  padding-top: 20px;
-┊ 17┊   ┊}
-┊ 18┊   ┊
-┊ 19┊   ┊.ma-filters {
-┊ 20┊   ┊  margin-bottom: 10px;
-┊ 21┊   ┊}
+┊   ┊  9┊  .parties-list {
+┊   ┊ 10┊    display: table-cell;
+┊   ┊ 11┊    width: 50%;
+┊   ┊ 12┊    vertical-align: top;
 ┊ 22┊ 13┊
-┊ 23┊   ┊.ma-party-item {
-┊ 24┊   ┊  .ma-party-name {
-┊ 25┊   ┊    margin-bottom: 20px;
-┊ 26┊   ┊    a {
-┊ 27┊   ┊      color: $color6;
-┊ 28┊   ┊      text-decoration: none !important;
-┊ 29┊   ┊      font-weight: 400;
+┊   ┊ 14┊    .pagination {
+┊   ┊ 15┊      display: inline;
+┊   ┊ 16┊      text-align: center;
 ┊ 30┊ 17┊    }
-┊ 31┊   ┊  }
-┊ 32┊   ┊  .ma-party-description {
-┊ 33┊   ┊    color: $color6;
-┊ 34┊   ┊    font-weight: 300;
-┊ 35┊   ┊    padding-left: 18px;
-┊ 36┊   ┊    font-size: 14px;
-┊ 37┊   ┊  }
 ┊ 38┊ 18┊
-┊ 39┊   ┊  .ma-remove {
-┊ 40┊   ┊    color: lighten($color7, 20%);
-┊ 41┊   ┊    position: absolute;
-┊ 42┊   ┊    right: 20px;
-┊ 43┊   ┊    top: 20px;
-┊ 44┊   ┊    &:hover {
-┊ 45┊   ┊      color: $color7;
+┊   ┊ 19┊    .filter-card {
+┊   ┊ 20┊      margin: 20px;
 ┊ 46┊ 21┊    }
-┊ 47┊   ┊  }
 ┊ 48┊ 22┊
-┊ 49┊   ┊  .ma-party-item-bottom {
-┊ 50┊   ┊    padding-top: 10px;
-┊ 51┊   ┊    .ma-posted-by-col {
-┊ 52┊   ┊      .ma-posted-by {
-┊ 53┊   ┊        color: darken($color4, 30%);
-┊ 54┊   ┊        font-size: 12px;
-┊ 55┊   ┊      }
-┊ 56┊   ┊      .ma-everyone-invited {
-┊ 57┊   ┊        @media (max-width: 400px) {
-┊ 58┊   ┊          display: block;
-┊ 59┊   ┊          i {
-┊ 60┊   ┊            margin-left: 0px !important;
-┊ 61┊   ┊          }
-┊ 62┊   ┊        }
-┊ 63┊   ┊        font-size: 12px;
-┊ 64┊   ┊        color: darken($color4, 10%);
-┊ 65┊   ┊        i {
-┊ 66┊   ┊          color: darken($color4, 10%);
-┊ 67┊   ┊          margin-left: 5px;
-┊ 68┊   ┊        }
-┊ 69┊   ┊      }
-┊ 70┊   ┊    }
+┊   ┊ 23┊    .party-card {
+┊   ┊ 24┊      margin: 20px;
+┊   ┊ 25┊      position: relative;
 ┊ 71┊ 26┊
-┊ 72┊   ┊    .ma-rsvp-buttons {
-┊ 73┊   ┊      input.btn {
-┊ 74┊   ┊        color: darken($color3, 20%);
-┊ 75┊   ┊        background: transparent !important;
-┊ 76┊   ┊        outline: none;
-┊ 77┊   ┊        padding-left: 0;
-┊ 78┊   ┊        &:active {
-┊ 79┊   ┊          box-shadow: none;
-┊ 80┊   ┊        }
-┊ 81┊   ┊        &:hover {
-┊ 82┊   ┊          color: darken($color3, 30%);
-┊ 83┊   ┊        }
-┊ 84┊   ┊        &.btn-primary {
-┊ 85┊   ┊          color: lighten($color3, 10%);
-┊ 86┊   ┊          border: 0;
-┊ 87┊   ┊          background: transparent !important;
-┊ 88┊   ┊        }
+┊   ┊ 27┊      .party-name > a {
+┊   ┊ 28┊        color: black;
+┊   ┊ 29┊        text-decoration: none;
 ┊ 89┊ 30┊      }
-┊ 90┊   ┊    }
 ┊ 91┊ 31┊
-┊ 92┊   ┊    .ma-rsvp-sum {
-┊ 93┊   ┊      width: 160px;
-┊ 94┊   ┊      @media (min-width: 400px) {
-┊ 95┊   ┊        float: right;
-┊ 96┊   ┊      }
-┊ 97┊   ┊      @media (max-width: 400px) {
-┊ 98┊   ┊        margin: 0 auto;
-┊ 99┊   ┊      }
-┊100┊   ┊    }
-┊101┊   ┊    .ma-rsvp-amount {
-┊102┊   ┊      display: inline-block;
-┊103┊   ┊      text-align: center;
-┊104┊   ┊      width: 50px;
-┊105┊   ┊      .ma-amount {
-┊106┊   ┊        font-weight: bold;
-┊107┊   ┊        font-size: 20px;
+┊   ┊ 32┊      .remove-party {
+┊   ┊ 33┊        position: absolute;
+┊   ┊ 34┊        top: 10px;
+┊   ┊ 35┊        right: 10px;
 ┊108┊ 36┊      }
-┊109┊   ┊      .ma-rsvp-title {
-┊110┊   ┊        font-size: 11px;
-┊111┊   ┊        color: #aaa;
-┊112┊   ┊        text-transform: uppercase;
+┊   ┊ 37┊
+┊   ┊ 38┊      .rsvp-container {
+┊   ┊ 39┊        position: absolute;
+┊   ┊ 40┊        bottom: 10px;
+┊   ┊ 41┊        right: 10px;
+┊   ┊ 42┊
+┊   ┊ 43┊        .rsvps-sum {
+┊   ┊ 44┊          display: inline-block;
+┊   ┊ 45┊          width: 50px;
+┊   ┊ 46┊          text-align: center;
+┊   ┊ 47┊
+┊   ┊ 48┊          .rsvps-amount {
+┊   ┊ 49┊            font-size: 24px;
+┊   ┊ 50┊          }
+┊   ┊ 51┊
+┊   ┊ 52┊          .rsvps-title {
+┊   ┊ 53┊            font-size: 13px;
+┊   ┊ 54┊            color: #aaa;
+┊   ┊ 55┊          }
+┊   ┊ 56┊        }
 ┊113┊ 57┊      }
 ┊114┊ 58┊    }
 ┊115┊ 59┊  }
-┊116┊   ┊}
 ┊117┊ 60┊
-┊118┊   ┊.ma-angular-map-col {
-┊119┊   ┊  .angular-google-map-container, .angular-google-map {
-┊120┊   ┊    height: 100%;
-┊121┊   ┊    width: 100%;
-┊122┊   ┊  }
-┊123┊   ┊}
+┊   ┊ 61┊  .parties-map {
+┊   ┊ 62┊    display: table-cell;
+┊   ┊ 63┊    width: 50%;
+┊   ┊ 64┊    vertical-align: top;
 ┊124┊ 65┊
-┊125┊   ┊.search-form {
-┊126┊   ┊  margin-bottom: 1em;
+┊   ┊ 66┊    .google-map {
+┊   ┊ 67┊      width: 100%;
+┊   ┊ 68┊      min-height: 600px;
+┊   ┊ 69┊    }
+┊   ┊ 70┊  }
 ┊127┊ 71┊}🚫↵
```
[}]: #

# PartyDetails component

We also need to update the PartyDetails component:

[{]: <helper> (diff_step 19.14)
#### Step 19.14: Update the layout of the party details

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,61 +1,56 @@
-┊ 1┊  ┊<div class="row ma-party-details-container">
-┊ 2┊  ┊  <div class="col-sm-6 col-sm-offset-3">
-┊ 3┊  ┊    <legend>View and Edit Your Party Details:</legend>
-┊ 4┊  ┊    <form class="form-horizontal" *ngIf="party" (submit)="saveParty()">
-┊ 5┊  ┊      <div class="form-group">
-┊ 6┊  ┊        <label>Party Name</label>
-┊ 7┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.name" name="name" class="form-control">
-┊ 8┊  ┊      </div>
+┊  ┊ 1┊<div class="party-details-container" *ngIf="party">
+┊  ┊ 2┊  <div class="row">
+┊  ┊ 3┊    <div class="party-details">
+┊  ┊ 4┊      <md-card>
+┊  ┊ 5┊        <h2>{{ party.name }}</h2>
+┊  ┊ 6┊        <form layout="column" (submit)="saveParty()">
+┊  ┊ 7┊          <label>Party Name: </label>
+┊  ┊ 8┊          <md-input [disabled]="!isOwner" [(ngModel)]="party.name" name="name"></md-input>
+┊  ┊ 9┊          <br />
+┊  ┊10┊          <label>Party Description: </label>
+┊  ┊11┊          <md-input [disabled]="!isOwner" [(ngModel)]="party.description" name="description"></md-input>
+┊  ┊12┊          <br />
+┊  ┊13┊          <label>Location name: </label>
+┊  ┊14┊          <md-input [disabled]="!isOwner" [(ngModel)]="party.location.name" name="location"></md-input>
+┊  ┊15┊          <br />
+┊  ┊16┊          <md-checkbox [disabled]="!isOwner" [(checked)]="party.public" name="public" aria-label="Public">
+┊  ┊17┊            Public party?
+┊  ┊18┊          </md-checkbox>
 ┊ 9┊19┊
-┊10┊  ┊      <div class="form-group">
-┊11┊  ┊        <label>Description</label>
-┊12┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description" class="form-control">
-┊13┊  ┊      </div>
-┊14┊  ┊
-┊15┊  ┊      <div class="form-group">
-┊16┊  ┊        <label>Location name</label>
-┊17┊  ┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location.name" name="location" class="form-control">
-┊18┊  ┊      </div>
-┊19┊  ┊
-┊20┊  ┊      <div class="form-group">
-┊21┊  ┊        <button [disabled]="!isOwner" type="submit" class="btn btn-primary">Save</button>
-┊22┊  ┊        <a [routerLink]="['/']" class="btn">Back</a>
-┊23┊  ┊      </div>
-┊24┊  ┊    </form>
-┊25┊  ┊
-┊26┊  ┊    <ul class="ma-invite-list" *ngIf="isOwner || isPublic">
-┊27┊  ┊      <h3>
-┊28┊  ┊        Users to invite:
-┊29┊  ┊      </h3>
-┊30┊  ┊      <li *ngFor="let user of users | async">
-┊31┊  ┊        <div>{{ user | displayName }}</div>
-┊32┊  ┊        <button (click)="invite(user)" class="btn btn-primary btn-sm">Invite</button>
-┊33┊  ┊      </li>
-┊34┊  ┊    </ul>
-┊35┊  ┊
-┊36┊  ┊    <div *ngIf="isInvited">
-┊37┊  ┊      <h2>Reply to the invitation</h2>
-┊38┊  ┊      <input type="button" class="btn btn-primary" value="I'm going!" (click)="reply('yes')">
-┊39┊  ┊      <input type="button" class="btn btn-warning" value="Maybe" (click)="reply('maybe')">
-┊40┊  ┊      <input type="button" class="btn btn-danger" value="No" (click)="reply('no')">
+┊  ┊20┊          <div layout="row" layout-align="left">
+┊  ┊21┊            <button [disabled]="!isOwner" type="submit" md-raised-button color="accent">Save</button>
+┊  ┊22┊            <a [routerLink]="['/']" md-raised-button class="md-raised">Back</a>
+┊  ┊23┊          </div>
+┊  ┊24┊        </form>
+┊  ┊25┊      </md-card>
 ┊41┊26┊    </div>
-┊42┊  ┊
-┊43┊  ┊    <h3 class="ma-map-title">
-┊44┊  ┊      Click the map to set the party location
-┊45┊  ┊    </h3>
-┊46┊  ┊
-┊47┊  ┊    <div class="angular-google-map-container">
-┊48┊  ┊      <sebm-google-map
-┊49┊  ┊        [latitude]="lat || centerLat"
-┊50┊  ┊        [longitude]="lng || centerLng"
-┊51┊  ┊        [zoom]="8"
-┊52┊  ┊        (mapClick)="mapClicked($event)">
-┊53┊  ┊        <sebm-google-map-marker
-┊54┊  ┊          *ngIf="lat && lng"
-┊55┊  ┊          [latitude]="lat"
-┊56┊  ┊          [longitude]="lng">
-┊57┊  ┊        </sebm-google-map-marker>
-┊58┊  ┊      </sebm-google-map>
+┊  ┊27┊    <div class="party-invites">
+┊  ┊28┊      <md-card>
+┊  ┊29┊        <h2>Invitations</h2>
+┊  ┊30┊        <span [hidden]="!party.public">Public party, no need for invitations!</span>
+┊  ┊31┊        <md-list>
+┊  ┊32┊          <md-list-item *ngFor="let user of users | async">
+┊  ┊33┊            <div>{{ user | displayName }}</div>
+┊  ┊34┊            <button (click)="invite(user)" md-raised-button>Invite</button>
+┊  ┊35┊          </md-list-item>
+┊  ┊36┊        </md-list>
+┊  ┊37┊      </md-card>
+┊  ┊38┊    </div>
+┊  ┊39┊    <div class="party-map">
+┊  ┊40┊      <md-card>
+┊  ┊41┊        <h2>Party location</h2>
+┊  ┊42┊        <sebm-google-map
+┊  ┊43┊          [latitude]="lat || centerLat"
+┊  ┊44┊          [longitude]="lng || centerLng"
+┊  ┊45┊          [zoom]="8"
+┊  ┊46┊          (mapClick)="mapClicked($event)">
+┊  ┊47┊          <sebm-google-map-marker
+┊  ┊48┊            *ngIf="lat && lng"
+┊  ┊49┊            [latitude]="lat"
+┊  ┊50┊            [longitude]="lng">
+┊  ┊51┊          </sebm-google-map-marker>
+┊  ┊52┊        </sebm-google-map>
+┊  ┊53┊      </md-card>
 ┊59┊54┊    </div>
 ┊60┊55┊  </div>
-┊61┊  ┊</div>🚫↵
+┊  ┊56┊</div>
```
[}]: #

And let's update the styles:

[{]: <helper> (diff_step 19.15)
#### Step 19.15: Updated the styles of the party details

##### Changed client/imports/app/parties/party-details.component.scss
```diff
@@ -1,32 +1,25 @@
-┊ 1┊  ┊.ma-party-details-container {
-┊ 2┊  ┊  padding: 20px;
+┊  ┊ 1┊.party-details-container {
+┊  ┊ 2┊  display: table;
 ┊ 3┊ 3┊
-┊ 4┊  ┊  .angular-google-map-container {
+┊  ┊ 4┊  .row {
+┊  ┊ 5┊    display: table-row;
 ┊ 5┊ 6┊    width: 100%;
-┊ 6┊  ┊    height: 100%;
-┊ 7┊  ┊  }
-┊ 8┊  ┊
-┊ 9┊  ┊  .angular-google-map {
-┊10┊  ┊    width: 100%;
-┊11┊  ┊    height: 400px;
-┊12┊  ┊  }
-┊13┊  ┊
-┊14┊  ┊  .ma-map-title {
-┊15┊  ┊    font-size: 16px;
-┊16┊  ┊    font-weight: bolder;
-┊17┊  ┊  }
 ┊18┊ 7┊
-┊19┊  ┊  .ma-invite-list {
-┊20┊  ┊    margin-top: 20px;
-┊21┊  ┊    margin-bottom: 20px;
+┊  ┊ 8┊    .party-details, .party-invites, .party-map {
+┊  ┊ 9┊      display: table-cell;
+┊  ┊10┊      width: 33.3%;
+┊  ┊11┊      vertical-align: top;
 ┊22┊12┊
-┊23┊  ┊    h3 {
-┊24┊  ┊      font-size: 16px;
-┊25┊  ┊      font-weight: bolder;
+┊  ┊13┊      md-card {
+┊  ┊14┊        margin: 20px;
+┊  ┊15┊      }
 ┊26┊16┊    }
 ┊27┊17┊
-┊28┊  ┊    ul {
-┊29┊  ┊      padding: 0;
+┊  ┊18┊    .party-map {
+┊  ┊19┊      sebm-google-map {
+┊  ┊20┊        height: 300px;
+┊  ┊21┊        width: 100%;
+┊  ┊22┊      }
 ┊30┊23┊    }
 ┊31┊24┊  }
 ┊32┊25┊}🚫↵
```
[}]: #

> In this point, you can also remove the `colors.scss` - it's no longer in use!

# Custom Authentication Components

Our next step will replace the `login-buttons` which is a simple and non-styled login/signup component - we will add our custom authentication component with custom style.

First, let's remove the login-buttons from the navigation bar, and replace it with custom buttons for Login / Signup / Logout.

We will also add `routerLink` to each button, and add logic to hide/show buttons according to the user's login state:

[{]: <helper> (diff_step 19.16)
#### Step 19.16: Replace login buttons with custom buttons

##### Changed client/imports/app/app.component.html
```diff
@@ -1,6 +1,13 @@
 ┊ 1┊ 1┊<md-toolbar color="primary">
 ┊ 2┊ 2┊  <a routerLink="/" class="toolbar-title">Socially2</a>
 ┊ 3┊ 3┊  <span class="fill-remaining-space"></span>
-┊ 4┊  ┊  <login-buttons></login-buttons>
+┊  ┊ 4┊  <div [hidden]="user">
+┊  ┊ 5┊    <a md-button [routerLink]="['/login']" >Login</a>
+┊  ┊ 6┊    <a md-button [routerLink]="['/signup']">Sign up</a>
+┊  ┊ 7┊  </div>
+┊  ┊ 8┊  <div [hidden]="!user">
+┊  ┊ 9┊    <span>{{ user | displayName }}</span>
+┊  ┊10┊    <button md-button (click)="logout()">Logout</button>
+┊  ┊11┊  </div>
 ┊ 5┊12┊</md-toolbar>
 ┊ 6┊13┊<router-outlet></router-outlet>🚫↵
```
[}]: #

Let's use `InjectUser` decorator, just like we did in one of the previous chapters.

[{]: <helper> (diff_step 19.17)
#### Step 19.17: Add auth logic to the App component

##### Changed client/imports/app/app.component.ts
```diff
@@ -2,10 +2,20 @@
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './app.component.html';
 ┊ 4┊ 4┊import style from './app.component.scss';
+┊  ┊ 5┊import {InjectUser} from "angular2-meteor-accounts-ui";
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@Component({
 ┊ 7┊ 8┊  selector: 'app',
 ┊ 8┊ 9┊  template,
 ┊ 9┊10┊  styles: [ style ]
 ┊10┊11┊})
-┊11┊  ┊export class AppComponent {}
+┊  ┊12┊@InjectUser('user')
+┊  ┊13┊export class AppComponent {
+┊  ┊14┊  constructor() {
+┊  ┊15┊
+┊  ┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  logout() {
+┊  ┊19┊    Meteor.logout();
+┊  ┊20┊  }
+┊  ┊21┊}
```
[}]: #

As you can see, we used `DisplayNamePipe` in the view so we have to import it.

We also implemented `logout()` method with `Meteor.logout()`. It is, like you probably guessed, to log out the current user.

Now we can move on to create three new components.

### Login component

First component, is to log in user to the app.

We will need a form and the login method, so let's implement them:

[{]: <helper> (diff_step 19.18)
#### Step 19.18: Create LoginComponent

##### Added client/imports/app/auth/login.component.ts
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './login.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'login',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class LoginComponent implements OnInit {
+┊  ┊13┊  loginForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.loginForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required],
+┊  ┊21┊      password: ['', Validators.required]
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    this.error = '';
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  login() {
+┊  ┊28┊    if (this.loginForm.valid) {
+┊  ┊29┊      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
+┊  ┊30┊        if (err) {
+┊  ┊31┊          this.zone.run(() => {
+┊  ┊32┊            this.error = err;
+┊  ┊33┊          });
+┊  ┊34┊        } else {
+┊  ┊35┊          this.router.navigate(['/']);
+┊  ┊36┊        }
+┊  ┊37┊      });
+┊  ┊38┊    }
+┊  ┊39┊  }
+┊  ┊40┊}🚫↵
```
[}]: #

> Notice that we used `NgZone` in our constructor in order to get it from the Dependency Injection, and we used it before we update the result of the login action - we need to do this because the Meteor world does not update Angular's world, and we need to tell Angular when to update the view since the async result of the login action comes from Meteor's context.

You previously created a form by yourself so there's no need to explain the whole process once again.

About the login method.

Meteor's accounts system has a method called `loginWithPassword`, you can read more about it [here](http://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword).

We need to provide two values, a email and a password. We could get them from the form.

In the callback of Meteor.loginWithPassword's method, we have the redirection to the homepage on success and we're saving the error message if login process failed.

Let's add the view:

[{]: <helper> (diff_step 19.19)
#### Step 19.19: Create a template for LoginComponent

##### Added client/imports/app/auth/login.component.html
```diff
@@ -0,0 +1,37 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Sign in
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-margin layout-padding>
+┊  ┊ 8┊      <div layout="row" layout-margin>
+┊  ┊ 9┊        <p class="md-body-2"> Sign in with your email</p>
+┊  ┊10┊      </div>
+┊  ┊11┊
+┊  ┊12┊      <form [formGroup]="loginForm" #f="ngForm" (ngSubmit)="login()"
+┊  ┊13┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊14┊
+┊  ┊15┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊16┊        <md-input formControlName="password" type="password" placeholder="Password"></md-input>
+┊  ┊17┊
+┊  ┊18┊        <div layout="row" layout-align="space-between center">
+┊  ┊19┊          <a md-button [routerLink]="['/recover']">Forgot password?</a>
+┊  ┊20┊          <button md-raised-button class="md-primary" type="submit" aria-label="login">Sign In</button>
+┊  ┊21┊        </div>
+┊  ┊22┊      </form>
+┊  ┊23┊
+┊  ┊24┊      <div [hidden]="error == ''">
+┊  ┊25┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊26┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊27┊        </md-toolbar>
+┊  ┊28┊      </div>
+┊  ┊29┊
+┊  ┊30┊      <md-divider></md-divider>
+┊  ┊31┊
+┊  ┊32┊      <div layout="row" layout-align="center">
+┊  ┊33┊        <a md-button [routerLink]="['/signup']">Need an account?</a>
+┊  ┊34┊      </div>
+┊  ┊35┊    </div>
+┊  ┊36┊  </div>
+┊  ┊37┊</div>🚫↵
```
[}]: #

We also need to define the `/login` route:

[{]: <helper> (diff_step 19.20)
#### Step 19.20: Add the login route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -3,10 +3,12 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
+┊  ┊ 6┊import {LoginComponent} from "./auth/login.component";
 ┊ 6┊ 7┊
 ┊ 7┊ 8┊export const routes: Route[] = [
 ┊ 8┊ 9┊  { path: '', component: PartiesListComponent },
-┊ 9┊  ┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] }
+┊  ┊10┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
+┊  ┊11┊  { path: 'login', component: LoginComponent }
 ┊10┊12┊];
 ┊11┊13┊
 ┊12┊14┊export const ROUTES_PROVIDERS = [{
```
[}]: #

And now let's create an index file for the auth files:

[{]: <helper> (diff_step 19.21)
#### Step 19.21: Create the index file for auth component

##### Added client/imports/app/auth/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import {LoginComponent} from "./login.component";
+┊ ┊2┊
+┊ ┊3┊export const AUTH_DECLARATIONS = [
+┊ ┊4┊  LoginComponent
+┊ ┊5┊];
```
[}]: #

And import the exposed Array into the `NgModule`:

[{]: <helper> (diff_step 19.22)
#### Step 19.22: Updated the NgModule imports

##### Changed client/imports/app/app.module.ts
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊import { PARTIES_DECLARATIONS } from './parties';
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
 ┊13┊13┊import { MaterialModule } from "@angular/material";
+┊  ┊14┊import { AUTH_DECLARATIONS } from "./auth/index";
 ┊14┊15┊
 ┊15┊16┊@NgModule({
 ┊16┊17┊  imports: [
```
```diff
@@ -28,7 +29,8 @@
 ┊28┊29┊  declarations: [
 ┊29┊30┊    AppComponent,
 ┊30┊31┊    ...PARTIES_DECLARATIONS,
-┊31┊  ┊    ...SHARED_DECLARATIONS
+┊  ┊32┊    ...SHARED_DECLARATIONS,
+┊  ┊33┊    ...AUTH_DECLARATIONS
 ┊32┊34┊  ],
 ┊33┊35┊  providers: [
 ┊34┊36┊    ...ROUTES_PROVIDERS
```
[}]: #

### Signup component

The Signup component looks pretty much the same as the Login component. We just use different method, `Accounts.createUser()`. Here's [the link](http://docs.meteor.com/api/passwords.html#Accounts-createUser) to the documentation.

[{]: <helper> (diff_step 19.23)
#### Step 19.23: Added the signup component

##### Added client/imports/app/auth/signup.component.ts
```diff
@@ -0,0 +1,43 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './signup.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'signup',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class SignupComponent implements OnInit {
+┊  ┊13┊  signupForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.signupForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required],
+┊  ┊21┊      password: ['', Validators.required]
+┊  ┊22┊    });
+┊  ┊23┊
+┊  ┊24┊    this.error = '';
+┊  ┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  signup() {
+┊  ┊28┊    if (this.signupForm.valid) {
+┊  ┊29┊      Accounts.createUser({
+┊  ┊30┊        email: this.signupForm.value.email,
+┊  ┊31┊        password: this.signupForm.value.password
+┊  ┊32┊      }, (err) => {
+┊  ┊33┊        if (err) {
+┊  ┊34┊          this.zone.run(() => {
+┊  ┊35┊            this.error = err;
+┊  ┊36┊          });
+┊  ┊37┊        } else {
+┊  ┊38┊          this.router.navigate(['/']);
+┊  ┊39┊        }
+┊  ┊40┊      });
+┊  ┊41┊    }
+┊  ┊42┊  }
+┊  ┊43┊}🚫↵
```
[}]: #

And the view:

[{]: <helper> (diff_step 19.24)
#### Step 19.24: Added the signup view

##### Added client/imports/app/auth/signup.component.html
```diff
@@ -0,0 +1,32 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Sign up
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <form [formGroup]="signupForm" #f="ngForm" (ngSubmit)="signup()"
+┊  ┊ 9┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊10┊
+┊  ┊11┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊12┊        <md-input formControlName="password" type="password" placeholder="Password"></md-input>
+┊  ┊13┊
+┊  ┊14┊        <div layout="row" layout-align="space-between center">
+┊  ┊15┊          <button md-raised-button class="md-primary" type="submit" aria-label="login">Sign Up</button>
+┊  ┊16┊        </div>
+┊  ┊17┊      </form>
+┊  ┊18┊
+┊  ┊19┊      <div [hidden]="error == ''">
+┊  ┊20┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊21┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊22┊        </md-toolbar>
+┊  ┊23┊      </div>
+┊  ┊24┊
+┊  ┊25┊      <md-divider></md-divider>
+┊  ┊26┊
+┊  ┊27┊      <div layout="row" layout-align="center">
+┊  ┊28┊        <a md-button [routerLink]="['/login']">Already a user?</a>
+┊  ┊29┊      </div>
+┊  ┊30┊    </div>
+┊  ┊31┊  </div>
+┊  ┊32┊</div>🚫↵
```
[}]: #

And add it to the index file:

[{]: <helper> (diff_step 19.25)
#### Step 19.25: Added signup component to the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import {LoginComponent} from "./login.component";
+┊ ┊2┊import {SignupComponent} from "./signup.component";
 ┊2┊3┊
 ┊3┊4┊export const AUTH_DECLARATIONS = [
-┊4┊ ┊  LoginComponent
+┊ ┊5┊  LoginComponent,
+┊ ┊6┊  SignupComponent
 ┊5┊7┊];
```
[}]: #

And the `/signup` route:

[{]: <helper> (diff_step 19.26)
#### Step 19.26: Added signup route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -4,11 +4,13 @@
 ┊ 4┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {LoginComponent} from "./auth/login.component";
+┊  ┊ 7┊import {SignupComponent} from "./auth/signup.component";
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊export const routes: Route[] = [
 ┊ 9┊10┊  { path: '', component: PartiesListComponent },
 ┊10┊11┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
-┊11┊  ┊  { path: 'login', component: LoginComponent }
+┊  ┊12┊  { path: 'login', component: LoginComponent },
+┊  ┊13┊  { path: 'signup', component: SignupComponent }
 ┊12┊14┊];
 ┊13┊15┊
 ┊14┊16┊export const ROUTES_PROVIDERS = [{
```
[}]: #

### Recover component

This component is helfup when a user forgets his password. We'll use `Accounts.forgotPassword` method:

[{]: <helper> (diff_step 19.27)
#### Step 19.27: Create the recover component

##### Added client/imports/app/auth/recover.component.ts
```diff
@@ -0,0 +1,41 @@
+┊  ┊ 1┊import {Component, OnInit, NgZone} from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 5┊
+┊  ┊ 6┊import template from './recover.component.html';
+┊  ┊ 7┊
+┊  ┊ 8┊@Component({
+┊  ┊ 9┊  selector: 'recover',
+┊  ┊10┊  template
+┊  ┊11┊})
+┊  ┊12┊export class RecoverComponent implements OnInit {
+┊  ┊13┊  recoverForm: FormGroup;
+┊  ┊14┊  error: string;
+┊  ┊15┊
+┊  ┊16┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
+┊  ┊17┊
+┊  ┊18┊  ngOnInit() {
+┊  ┊19┊    this.recoverForm = this.formBuilder.group({
+┊  ┊20┊      email: ['', Validators.required]
+┊  ┊21┊    });
+┊  ┊22┊
+┊  ┊23┊    this.error = '';
+┊  ┊24┊  }
+┊  ┊25┊
+┊  ┊26┊  recover() {
+┊  ┊27┊    if (this.recoverForm.valid) {
+┊  ┊28┊      Accounts.forgotPassword({
+┊  ┊29┊        email: this.recoverForm.value.email
+┊  ┊30┊      }, (err) => {
+┊  ┊31┊        if (err) {
+┊  ┊32┊          this.zone.run(() => {
+┊  ┊33┊            this.error = err;
+┊  ┊34┊          });
+┊  ┊35┊        } else {
+┊  ┊36┊          this.router.navigate(['/']);
+┊  ┊37┊        }
+┊  ┊38┊      });
+┊  ┊39┊    }
+┊  ┊40┊  }
+┊  ┊41┊}🚫↵
```
[}]: #

Create the view:

[{]: <helper> (diff_step 19.28)
#### Step 19.28: Create the recover component view

##### Added client/imports/app/auth/recover.component.html
```diff
@@ -0,0 +1,31 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Recover Your Password
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <form [formGroup]="recoverForm" #f="ngForm" (ngSubmit)="recover()"
+┊  ┊ 9┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊10┊
+┊  ┊11┊        <md-input formControlName="email" type="email" placeholder="Email"></md-input>
+┊  ┊12┊
+┊  ┊13┊        <div layout="row" layout-align="space-between center">
+┊  ┊14┊          <button md-raised-button class="md-primary" type="submit" aria-label="Recover">Recover</button>
+┊  ┊15┊        </div>
+┊  ┊16┊      </form>
+┊  ┊17┊
+┊  ┊18┊      <div [hidden]="error == ''">
+┊  ┊19┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊20┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊21┊        </md-toolbar>
+┊  ┊22┊      </div>
+┊  ┊23┊
+┊  ┊24┊      <md-divider></md-divider>
+┊  ┊25┊
+┊  ┊26┊      <div layout="row" layout-align="center">
+┊  ┊27┊        <a md-button [routerLink]="['/login']">Remember your password?</a>
+┊  ┊28┊      </div>
+┊  ┊29┊    </div>
+┊  ┊30┊  </div>
+┊  ┊31┊</div>🚫↵
```
[}]: #

And add it to the index file:

[{]: <helper> (diff_step 19.29)
#### Step 19.29: Added the recover component to the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import {LoginComponent} from "./login.component";
 ┊2┊2┊import {SignupComponent} from "./signup.component";
+┊ ┊3┊import {RecoverComponent} from "./recover.component";
 ┊3┊4┊
 ┊4┊5┊export const AUTH_DECLARATIONS = [
 ┊5┊6┊  LoginComponent,
-┊6┊ ┊  SignupComponent
+┊ ┊7┊  SignupComponent,
+┊ ┊8┊  RecoverComponent
 ┊7┊9┊];
```
[}]: #

And add the `/reset` route:

[{]: <helper> (diff_step 19.30)
#### Step 19.30: Added the recover route

##### Changed client/imports/app/app.routes.ts
```diff
@@ -5,12 +5,14 @@
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
 ┊ 6┊ 6┊import {LoginComponent} from "./auth/login.component";
 ┊ 7┊ 7┊import {SignupComponent} from "./auth/signup.component";
+┊  ┊ 8┊import {RecoverComponent} from "./auth/recover.component";
 ┊ 8┊ 9┊
 ┊ 9┊10┊export const routes: Route[] = [
 ┊10┊11┊  { path: '', component: PartiesListComponent },
 ┊11┊12┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
 ┊12┊13┊  { path: 'login', component: LoginComponent },
-┊13┊  ┊  { path: 'signup', component: SignupComponent }
+┊  ┊14┊  { path: 'signup', component: SignupComponent },
+┊  ┊15┊  { path: 'recover', component: RecoverComponent }
 ┊14┊16┊];
 ┊15┊17┊
 ┊16┊18┊export const ROUTES_PROVIDERS = [{
```
[}]: #

That's it! we just implemented our own authentication components using Meteor's Accounts API and Angular2-Material!

> Note that the recovery email won't be sent to the actual email address, since you need to configure `email` package to work with your email provider. you can read more about it [here](https://docs.meteor.com/api/email.html).

# Layout and Flex

In order to use flex and layout that defined in Material, we need to add a bug CSS file into our project, that defined CSS classes for `flex` and `layout`.

You can find the CSS file content [here](https://github.com/Urigo/meteor-angular2.0-socially/blob/246f008895980e63ab19f19c6b184f4eb632723c/client/imports/material-layout.scss).

So let's copy it's content and add it to `client/imports/material-layout.scss`.

Now let's add it to the main SCSS file imports:

[{]: <helper> (diff_step 19.32)
#### Step 19.32: Added import in the main scss file

##### Changed client/main.scss
```diff
@@ -22,3 +22,5 @@
 ┊22┊22┊  width: 450px;
 ┊23┊23┊  height: 450px;
 ┊24┊24┊}
+┊  ┊25┊
+┊  ┊26┊@import "./imports/material-layout";🚫↵
```
[}]: #

And let's add another CSS class missing:

[{]: <helper> (diff_step 19.33)
#### Step 19.33: Added missing CSS

##### Changed client/main.scss
```diff
@@ -23,4 +23,8 @@
 ┊23┊23┊  height: 450px;
 ┊24┊24┊}
 ┊25┊25┊
+┊  ┊26┊.md-whiteframe-z2 {
+┊  ┊27┊  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
+┊  ┊28┊}
+┊  ┊29┊
 ┊26┊30┊@import "./imports/material-layout";🚫↵
```
[}]: #

> The import of this CSS file is temporary, and we will need to use it only because `angular2-material` is still in beta and not implemented all the features.

# Summary

In this chapter we replaced Boostrap4 with Angular2-Material, and updated all the view and layout to match the component we got from it.

We also learnt how to use Meteor's Accounts API and how to implement authentication view and components, and how to connect them to our app.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step18.md) | [Next Step >](step20.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #