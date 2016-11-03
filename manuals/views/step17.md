[{]: <region> (header)
# Step 17: Google Maps
[}]: #
[{]: <region> (body)
As you see, our app looks far from fancy using only
pure HTML templates. It urgently needs graphical design improvements
to be usable. We are going to fix this issue in the next three steps starting
from the current. Ultimately, we'll try out two graphical design front-end libraries: Twitter's Bootstrap and Google's Material Design,
which are among most popular design libraries and has multiple open-source implementations on the market.

But first up, we'll add one more visual feature to the Socially: maps.
This will be quite beneficial, taking into account specifics of our app:
parties need precise locations to avoid confusions.
We are going to imploy this package of Google Maps components for Angular 2.

# Adding Location Coordinates

Having maps on board, we can make use of latitute and
longitute coordinates, which are most precise location information possible.
And of course, we'll show everything on the map to make this information
comprehensive for users.

There are two pages in the app which will be changed: main page to
show all parties' locations on the map and party details page to show and
change a particular party's location on the map. If it's done nicely,
it will certantly look terrific and attract more users to the app.

Before we start with the maps directly, we need to make some preparations.
First up, we need to extend `Party`'s with two more properties: "lat" and "lng",
which are the above mentioned latitude and longitude.
Since we have the location name and would like not to remove it since it still might be useful,
let's consider converting "location" property to an object with three properties: "name", "lat", and "lng".
It will require, though, some changes in other parts of the app, where `Party` type is used.

Let's add those changes consequently, starting from `Party` type itself:

[{]: <helper> (diff_step 17.1)
#### Step 17.1: Extend party location with coords

##### Changed both/models/party.model.ts
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊export interface Party extends CollectionObject {
 ┊4┊4┊  name: string;
 ┊5┊5┊  description: string;
-┊6┊ ┊  location: string;
+┊ ┊6┊  location: Location;
 ┊7┊7┊  owner?: string;
 ┊8┊8┊  public: boolean;
 ┊9┊9┊  invited?: string[];
```
```diff
@@ -13,4 +13,10 @@
 ┊13┊13┊interface RSVP {
 ┊14┊14┊  userId: string;
 ┊15┊15┊  response: string;
+┊  ┊16┊}
+┊  ┊17┊
+┊  ┊18┊interface Location {
+┊  ┊19┊  name: string;
+┊  ┊20┊  lat?: number;
+┊  ┊21┊  lng?: number;
 ┊16┊22┊}🚫↵
```
[}]: #

Then, change the parties, that are created and added on the server initially, accordingly:

[{]: <helper> (diff_step 17.2)
#### Step 17.2: Change initial parties accordingly

##### Changed server/imports/fixtures/parties.ts
```diff
@@ -6,17 +6,23 @@
 ┊ 6┊ 6┊    const parties: Party[] = [{
 ┊ 7┊ 7┊      name: 'Dubstep-Free Zone',
 ┊ 8┊ 8┊      description: 'Can we please just for an evening not listen to dubstep.',
-┊ 9┊  ┊      location: 'Palo Alto',
+┊  ┊ 9┊      location: {
+┊  ┊10┊        name: 'Palo Alto'
+┊  ┊11┊      },
 ┊10┊12┊      public: true
 ┊11┊13┊    }, {
 ┊12┊14┊      name: 'All dubstep all the time',
 ┊13┊15┊      description: 'Get it on!',
-┊14┊  ┊      location: 'Palo Alto',
+┊  ┊16┊      location: {
+┊  ┊17┊        name: 'Palo Alto'
+┊  ┊18┊      },
 ┊15┊19┊      public: true
 ┊16┊20┊    }, {
 ┊17┊21┊      name: 'Savage lounging',
 ┊18┊22┊      description: 'Leisure suit required. And only fiercest manners.',
-┊19┊  ┊      location: 'San Francisco',
+┊  ┊23┊      location: {
+┊  ┊24┊        name: 'San Francisco'
+┊  ┊25┊      },
 ┊20┊26┊      public: false
 ┊21┊27┊    }];
```
[}]: #

The PartiesForm component needs to be changed too to reflect type changes:

[{]: <helper> (diff_step 17.3)
#### Step 17.3: Change party creation component

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -33,7 +33,15 @@
 ┊33┊33┊    }
 ┊34┊34┊
 ┊35┊35┊    if (this.addForm.valid) {
-┊36┊  ┊      Parties.insert(Object.assign({}, this.addForm.value, { owner: Meteor.userId() }));
+┊  ┊36┊      Parties.insert({
+┊  ┊37┊        name: this.addForm.value.name,
+┊  ┊38┊        description: this.addForm.value.description,
+┊  ┊39┊        location: {
+┊  ┊40┊          name: this.addForm.value.location
+┊  ┊41┊        },
+┊  ┊42┊        public: this.addForm.value.public,
+┊  ┊43┊        owner: Meteor.userId()
+┊  ┊44┊      });
 ┊37┊45┊
 ┊38┊46┊      this.addForm.reset();
 ┊39┊47┊    }
```
[}]: #

Lastly, we are updating the parties publications. It's interesting to
see what a small change is required to update the parties search by location: it needs only to point out that "location" property has been moved to "location.name", thanks to Mongo's flexible API:

[{]: <helper> (diff_step 17.4)
#### Step 17.4: Reflect type changes in the parties search

##### Changed server/imports/publications/parties.ts
```diff
@@ -60,7 +60,7 @@
 ┊60┊60┊
 ┊61┊61┊  return {
 ┊62┊62┊    $and: [{
-┊63┊  ┊        location: searchRegEx
+┊  ┊63┊        'location.name': searchRegEx
 ┊64┊64┊      },
 ┊65┊65┊      isAvailable
 ┊66┊66┊    ]
```
[}]: #

And also let's update it in the view:

[{]: <helper> (diff_step 17.7)
#### Step 17.7: Change ngModel to location.name

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description">
 ┊ 7┊ 7┊
 ┊ 8┊ 8┊  <label>Location</label>
-┊ 9┊  ┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location" name="location">
+┊  ┊ 9┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location.name" name="location">
 ┊10┊10┊
 ┊11┊11┊  <button [disabled]="!isOwner" type="submit">Save</button>
 ┊12┊12┊  <a [routerLink]="['/']">Cancel</a>
```
[}]: #

Now when we are done with updates, let's reset the database in case it has
parties of the old type (remember how to do it? Execute `meteor reset`). Then, run the app to make sure that everything is alright and
works as before.

# Adding Google Maps

Now is the time to upgrade above mentioned components to feature Google Maps.
Let's add a Meteor package that wraps around that Google Maps NPM package:

    $ meteor npm install angular2-google-maps --save

And just like any other external package, we need to import the module into our `NgModule`:

[{]: <helper> (diff_step 17.6)
#### Step 17.6: Import google maps module

##### Changed client/imports/app/app.module.ts
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { RouterModule } from '@angular/router';
 ┊ 5┊ 5┊import { AccountsModule } from 'angular2-meteor-accounts-ui';
 ┊ 6┊ 6┊import { Ng2PaginationModule } from 'ng2-pagination';
+┊  ┊ 7┊import { AgmCoreModule } from 'angular2-google-maps/core';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊import { AppComponent } from './app.component';
 ┊ 9┊10┊import { routes, ROUTES_PROVIDERS } from './app.routes';
```
```diff
@@ -17,7 +18,10 @@
 ┊17┊18┊    ReactiveFormsModule,
 ┊18┊19┊    RouterModule.forRoot(routes),
 ┊19┊20┊    AccountsModule,
-┊20┊  ┊    Ng2PaginationModule
+┊  ┊21┊    Ng2PaginationModule,
+┊  ┊22┊    AgmCoreModule.forRoot({
+┊  ┊23┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
+┊  ┊24┊    })
 ┊21┊25┊  ],
 ┊22┊26┊  declarations: [
 ┊23┊27┊    AppComponent,
```
[}]: #

The maps package contains two major directives: one is to render a HTML container with Google Maps,
another one is to visualize a map marker. Let's add a maps markup to the PartyDetails component's template:

[{]: <helper> (diff_step 17.8)
#### Step 17.8: Use in a template

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -28,3 +28,15 @@
 ┊28┊28┊  <input type="button" value="Maybe" (click)="reply('maybe')">
 ┊29┊29┊  <input type="button" value="No" (click)="reply('no')">
 ┊30┊30┊</div>
+┊  ┊31┊
+┊  ┊32┊<sebm-google-map
+┊  ┊33┊  [latitude]="lat || centerLat"
+┊  ┊34┊  [longitude]="lng || centerLng"
+┊  ┊35┊  [zoom]="8"
+┊  ┊36┊  (mapClick)="mapClicked($event)">
+┊  ┊37┊  <sebm-google-map-marker
+┊  ┊38┊    *ngIf="lat && lng"
+┊  ┊39┊    [latitude]="lat"
+┊  ┊40┊    [longitude]="lng">
+┊  ┊41┊  </sebm-google-map-marker>
+┊  ┊42┊</sebm-google-map>🚫↵
```
[}]: #

It needs some explanation. Our markup now contains these two directives.
As you can see, parent map container directive has a party marker directive as a child element, so that it can be
parsed and rendered on the map. We are setting "latitude" and "longitude" on the map directive, which will fixate the map at a particular location on the page load.

You may notice as well, four new properties were added:
"lat", "lng", "centerLat", and "centerLng". "lat" and "lng" are wrappers over a party's coordinates, while "centerLat" and "centerLng" are default center coordinates.
In addition, location property binding has been corrected to reflect new type changes.

Here come changes to the component itself, including imports, new coordinates properties, and maps click event handler:

[{]: <helper> (diff_step 17.9)
#### Step 17.9: Add maps logic to the component

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import { Meteor } from 'meteor/meteor';
 ┊ 6┊ 6┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 7┊ 7┊import { InjectUser } from "angular2-meteor-accounts-ui";
+┊  ┊ 8┊import { MouseEvent } from "angular2-google-maps/core";
 ┊ 8┊ 9┊
 ┊ 9┊10┊import 'rxjs/add/operator/map';
 ┊10┊11┊
```
```diff
@@ -28,6 +29,9 @@
 ┊28┊29┊  users: Observable<User>;
 ┊29┊30┊  uninvitedSub: Subscription;
 ┊30┊31┊  user: Meteor.User;
+┊  ┊32┊  // Default center Palo Alto coordinates.
+┊  ┊33┊  centerLat: number = 37.4292;
+┊  ┊34┊  centerLng: number = -122.1381;
 ┊31┊35┊
 ┊32┊36┊  constructor(
 ┊33┊37┊    private route: ActivatedRoute
```
```diff
@@ -121,6 +125,20 @@
 ┊121┊125┊    return false;
 ┊122┊126┊  }
 ┊123┊127┊
+┊   ┊128┊
+┊   ┊129┊  get lat(): number {
+┊   ┊130┊    return this.party && this.party.location.lat;
+┊   ┊131┊  }
+┊   ┊132┊
+┊   ┊133┊  get lng(): number {
+┊   ┊134┊    return this.party && this.party.location.lng;
+┊   ┊135┊  }
+┊   ┊136┊
+┊   ┊137┊  mapClicked($event: MouseEvent) {
+┊   ┊138┊    this.party.location.lat = $event.coords.lat;
+┊   ┊139┊    this.party.location.lng = $event.coords.lng;
+┊   ┊140┊  }
+┊   ┊141┊
 ┊124┊142┊  ngOnDestroy() {
 ┊125┊143┊    this.paramsSub.unsubscribe();
 ┊126┊144┊    this.partySub.unsubscribe();
```
[}]: #

It's going to work in a scenario as follows:

  - when the user visit a newly created party,
    she will see a map centered at Palo Alto;
  - if she clicks on some part of the map, a new marker
    will be placed at that place;
  - if she decides to save the party changes, new location coordinates will
    be saved as well;
  - on the next visit, the map will be centered at the saved party location
    with a marker shown at this point.

That's almost it with the party details. So far, so good and simple.

The last change will be about CSS styles. To show the map container of a specific size,
we'll have to set element styles. Since we'll need styles for that for two pages, let's create
a separate CSS file for the whole app, which is, anyways, will be useful on the next steps:

[{]: <helper> (diff_step 17.10)
#### Step 17.10: Add maps styles

##### Added client/main.scss
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊.sebm-google-map-container {
+┊ ┊2┊  width: 400px;
+┊ ┊3┊  height: 400px;
+┊ ┊4┊}🚫↵
```
[}]: #

As usual, having introduced new feature, we are finishing it up with testing.
Let's create a new party with the location name set to some existing place you know, and go to the details page. Click on the maps at the
location that corresponds to the party's location name: a new marker should appear there.
Now, click "Save" button and re-load the page: it should be loaded with the map and a marker on it at
the point you've just pointed out.

# Multiple Markers

Adding multiple markers on the parties front page should be straightforward now.
Here is the markup:

[{]: <helper> (diff_step 17.11)
#### Step 17.11: Add all parties locations on the map

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -18,7 +18,7 @@
 ┊18┊18┊    <li *ngFor="let party of parties | async">
 ┊19┊19┊      <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊20┊20┊      <p>{{party.description}}</p>
-┊21┊  ┊      <p>{{party.location}}</p>
+┊  ┊21┊      <p>{{party.location.name}}</p>
 ┊22┊22┊      <button [hidden]="!isOwner(party)" (click)="removeParty(party)">X</button>
 ┊23┊23┊      <div>
 ┊24┊24┊        Who is coming:
```
```diff
@@ -29,5 +29,18 @@
 ┊29┊29┊    </li>
 ┊30┊30┊  </ul>
 ┊31┊31┊
+┊  ┊32┊  <sebm-google-map
+┊  ┊33┊    [latitude]="0"
+┊  ┊34┊    [longitude]="0"
+┊  ┊35┊    [zoom]="1">
+┊  ┊36┊    <div *ngFor="let party of parties | async">
+┊  ┊37┊      <sebm-google-map-marker
+┊  ┊38┊        *ngIf="party.location.lat"
+┊  ┊39┊        [latitude]="party.location.lat"
+┊  ┊40┊        [longitude]="party.location.lng">
+┊  ┊41┊      </sebm-google-map-marker>
+┊  ┊42┊    </div>
+┊  ┊43┊  </sebm-google-map>
+┊  ┊44┊
 ┊32┊45┊  <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
 ┊33┊46┊</div>🚫↵
```
[}]: #

As you can see, we are looping through the all parties and adding a new marker for each party,
having checked if the current party has location coordinates available.
We are also setting the minimum zoom and zero central coordinates on the map to set whole Earth view point initially.

# Summary

It turned to be quite easy to add location coordinates to the parties and make
changes to the UI, which included Google Maps and location markers on them.

Now we are all set to proceed to more radical visual design changes.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step16.md) | [Next Step >](step18.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #