[{]: <region> (header)
# Step 16: Conditional template directives with AngularJS
[}]: #
[{]: <region> (body)
In this step we are going to show or hide
different parts of the app's UI depending the user's current state: either logged-in or anonymous.

# Attribute Binding

As you may know, Angular 1 has [ng-show](https://docs.angularjs.org/api/ng/directive/ngShow) and [ng-hide](https://docs.angularjs.org/api/ng/directive/ngHide)
attribute directives for controlling the visibility of content.
We'll look at how visibility is handled differently in Angular 2.

Angular 2 binds an attribute to an element's property.
As you already know, one can directly bind to the component attribute directives, for example:

    <my-component [foo]="fooValue" />

The Angular 2 team went further and implemented the same direct binding support for the
DOM element attributes, including additional attributes like _hidden_ and _disabled_, and which seems logical.

### [hidden]

The `hidden` attribute arrived in the DOM with HTML 5.
It's essentially similar to the old and well-known `disabled` attribute, but only
makes an element hidden. With the presence of the `hidden` attribute and direct attribute
binding, it seems there is no further need for attribute directives like `ng-hide`.
There is one exception, though.

> The DOM property `hidden` is rather new, and not supported by older versions of Internet Explorer (less than 11).
> If you need to support older browsers, you must implement a new directive attribute similar to the `ng-hide`
> yourself or make use of an already existing directive. There are sure to be solutions in the future.

A user who hasn't logged-in does not have all the same permissions; we can hide functionality that anonymous users cannot access such as the "add party" form and the "remove" button for each party in the parties list.

Let's toggle on and off these components with the help of the `hidden` attribute, but first let's inject
the user property into the PartiesList component, since this is what our attribute
binding will depend on. User injection was already mentioned in step 8,
so let's make practical use of it now:

[{]: <helper> (diff_step 16.1)
#### Step 16.1: Inject Meteor User and add isOwner method

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 6┊ 6┊import { PaginationService } from 'ng2-pagination';
 ┊ 7┊ 7┊import { Counts } from 'meteor/tmeasday:publish-counts';
+┊  ┊ 8┊import { InjectUser } from "angular2-meteor-accounts-ui";
 ┊ 8┊ 9┊
 ┊ 9┊10┊import 'rxjs/add/operator/combineLatest';
 ┊10┊11┊
```
```diff
@@ -26,6 +27,7 @@
 ┊26┊27┊  selector: 'parties-list',
 ┊27┊28┊  template
 ┊28┊29┊})
+┊  ┊30┊@InjectUser('user')
 ┊29┊31┊export class PartiesListComponent implements OnInit, OnDestroy {
 ┊30┊32┊  parties: Observable<Party[]>;
 ┊31┊33┊  partiesSub: Subscription;
```
```diff
@@ -36,6 +38,7 @@
 ┊36┊38┊  partiesSize: number = 0;
 ┊37┊39┊  autorunSub: Subscription;
 ┊38┊40┊  location: Subject<string> = new Subject<string>();
+┊  ┊41┊  user: Meteor.User;
 ┊39┊42┊
 ┊40┊43┊  constructor(
 ┊41┊44┊    private paginationService: PaginationService
```
```diff
@@ -104,6 +107,10 @@
 ┊104┊107┊    this.nameOrder.next(parseInt(nameOrder));
 ┊105┊108┊  }
 ┊106┊109┊
+┊   ┊110┊  isOwner(party: Party): boolean {
+┊   ┊111┊    return this.user && this.user._id === party.owner;
+┊   ┊112┊  }
+┊   ┊113┊
 ┊107┊114┊  ngOnDestroy() {
 ┊108┊115┊    this.partiesSub.unsubscribe();
 ┊109┊116┊    this.optionsSub.unsubscribe();
```
[}]: #

As you can see, we've added a new `isOwner` method to the component,
thus, we allow only a party owner to remove the party.

Then, change the template to use the `hidden` attribute:

[{]: <helper> (diff_step 16.2)
#### Step 16.2: Use the hidden attribute in the PartiestList

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊<div>
-┊2┊ ┊  <parties-form style="float: left"></parties-form>
+┊ ┊2┊  <parties-form [hidden]="!user" style="float: left"></parties-form>
 ┊3┊3┊  <input type="text" #searchtext placeholder="Search by Location">
 ┊4┊4┊  <button type="button" (click)="search(searchtext.value)">Search</button>
 ┊5┊5┊  
```
```diff
@@ -19,7 +19,7 @@
 ┊19┊19┊      <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊20┊20┊      <p>{{party.description}}</p>
 ┊21┊21┊      <p>{{party.location}}</p>
-┊22┊  ┊      <button (click)="removeParty(party)">X</button>
+┊  ┊22┊      <button [hidden]="!isOwner(party)" (click)="removeParty(party)">X</button>
 ┊23┊23┊      <div>
 ┊24┊24┊        Who is coming:
 ┊25┊25┊        Yes - {{party | rsvp:'yes'}}
```
[}]: #

Now run the app.

The "add party" form and "remove" buttons should disappear if you are not logged-in. Try to log in: everything should be visible again.

> Note: CSS's `display` property has priority over the `hidden` property.
> If one of the CSS classes of any element has this property set,
> `hidden` gets over-ruled. In this case, you'll have to wrap the element into
> a container element such as a `<div>` and assign CSS classes with the "display" on that parent container.

### [disabled]

Next let's add the `disabled` attribute to the PartyDetails component.
Currently, all users have access to the party details page and can
change the values of the inputs, though they are still prohibited from saving anything
(remember the parties security added in step 8?).
Let's disable these inputs for users that are not owners.

We will get an `isOwner` property when the party owner matches the logged-in user id:

[{]: <helper> (diff_step 16.3)
#### Step 16.3: Add isOwner property

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { Subscription } from 'rxjs/Subscription';
 ┊ 5┊ 5┊import { Meteor } from 'meteor/meteor';
 ┊ 6┊ 6┊import { MeteorObservable } from 'meteor-rxjs';
+┊  ┊ 7┊import { InjectUser } from "angular2-meteor-accounts-ui";
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊import 'rxjs/add/operator/map';
 ┊ 9┊10┊
```
```diff
@@ -18,6 +19,7 @@
 ┊18┊19┊  selector: 'party-details',
 ┊19┊20┊  template
 ┊20┊21┊})
+┊  ┊22┊@InjectUser('user')
 ┊21┊23┊export class PartyDetailsComponent implements OnInit, OnDestroy {
 ┊22┊24┊  partyId: string;
 ┊23┊25┊  paramsSub: Subscription;
```
```diff
@@ -25,6 +27,7 @@
 ┊25┊27┊  partySub: Subscription;
 ┊26┊28┊  users: Observable<User>;
 ┊27┊29┊  uninvitedSub: Subscription;
+┊  ┊30┊  user: Meteor.User;
 ┊28┊31┊
 ┊29┊32┊  constructor(
 ┊30┊33┊    private route: ActivatedRoute
```
```diff
@@ -99,6 +102,10 @@
 ┊ 99┊102┊    });
 ┊100┊103┊  }
 ┊101┊104┊
+┊   ┊105┊  get isOwner(): boolean {
+┊   ┊106┊    return this.party && this.user && this.user._id === this.party.owner;
+┊   ┊107┊  }
+┊   ┊108┊
 ┊102┊109┊  ngOnDestroy() {
 ┊103┊110┊    this.paramsSub.unsubscribe();
 ┊104┊111┊    this.partySub.unsubscribe();
```
[}]: #

`isOwner` can be used before the subscription has finished, so we must check if the `party` property is available before checking if the party owner matches.

Then, let's add our new `[disabled]` condition to the party details template:

[{]: <helper> (diff_step 16.4)
#### Step 16.4: Add disabled attribute bindings

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,14 +1,14 @@
 ┊ 1┊ 1┊<form *ngIf="party" (submit)="saveParty()">
 ┊ 2┊ 2┊  <label>Name</label>
-┊ 3┊  ┊  <input type="text" [(ngModel)]="party.name" name="name">
+┊  ┊ 3┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.name" name="name">
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊  <label>Description</label>
-┊ 6┊  ┊  <input type="text" [(ngModel)]="party.description" name="description">
+┊  ┊ 6┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description">
 ┊ 7┊ 7┊
 ┊ 8┊ 8┊  <label>Location</label>
-┊ 9┊  ┊  <input type="text" [(ngModel)]="party.location" name="location">
+┊  ┊ 9┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location" name="location">
 ┊10┊10┊
-┊11┊  ┊  <button type="submit">Save</button>
+┊  ┊11┊  <button [disabled]="!isOwner" type="submit">Save</button>
 ┊12┊12┊  <a [routerLink]="['/']">Cancel</a>
 ┊13┊13┊</form>
```
[}]: #

# Using `ngIf`

It's important to know the difference between the `hidden` attribute and `ngIf` directive.
While `hidden` shows and hides a DOM element that is already rendered,
`ngIf` adds or removes an element from the DOM, making it both heavier and slower.
It makes sense to use `ngIf` if the decision to show or hide some part of the UI is made during page loading.

Regarding our party details page, we'll show or hide with the help of `ngIf`.
We'll show or hide the invitation response buttons to those who are already invited,
and the invitation list to the party owners and to everybody if the party is public.

We've already added our `isOwner` variable. Let's add two more: `isPublic` and `isInvited`.

[{]: <helper> (diff_step 16.5)
#### Step 16.5: Add isPublic and isInvited properties

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -81,7 +81,8 @@
 ┊81┊81┊      $set: {
 ┊82┊82┊        name: this.party.name,
 ┊83┊83┊        description: this.party.description,
-┊84┊  ┊        location: this.party.location
+┊  ┊84┊        location: this.party.location,
+┊  ┊85┊        'public': this.party.public
 ┊85┊86┊      }
 ┊86┊87┊    });
 ┊87┊88┊  }
```
```diff
@@ -106,6 +107,20 @@
 ┊106┊107┊    return this.party && this.user && this.user._id === this.party.owner;
 ┊107┊108┊  }
 ┊108┊109┊
+┊   ┊110┊  get isPublic(): boolean {
+┊   ┊111┊    return this.party && this.party.public;
+┊   ┊112┊  }
+┊   ┊113┊
+┊   ┊114┊  get isInvited(): boolean {
+┊   ┊115┊    if (this.party && this.user) {
+┊   ┊116┊      const invited = this.party.invited || [];
+┊   ┊117┊
+┊   ┊118┊      return invited.indexOf(this.user._id) !== -1;
+┊   ┊119┊    }
+┊   ┊120┊
+┊   ┊121┊    return false;
+┊   ┊122┊  }
+┊   ┊123┊
 ┊109┊124┊  ngOnDestroy() {
 ┊110┊125┊    this.paramsSub.unsubscribe();
 ┊111┊126┊    this.partySub.unsubscribe();
```
[}]: #

Then, make use of the properties in the template:

[{]: <helper> (diff_step 16.6)
#### Step 16.6: Make use of properties in the template

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -12,15 +12,17 @@
 ┊12┊12┊  <a [routerLink]="['/']">Cancel</a>
 ┊13┊13┊</form>
 ┊14┊14┊
-┊15┊  ┊<p>Users to invite:</p>
-┊16┊  ┊<ul>
-┊17┊  ┊  <li *ngFor="let user of users | async">
-┊18┊  ┊    <div>{{user | displayName}}</div>
-┊19┊  ┊    <button (click)="invite(user)">Invite</button>
-┊20┊  ┊  </li>
-┊21┊  ┊</ul>
+┊  ┊15┊<div *ngIf="isOwner || isPublic">
+┊  ┊16┊  <p>Users to invite:</p>
+┊  ┊17┊  <ul>
+┊  ┊18┊    <li *ngFor="let user of users | async">
+┊  ┊19┊      <div>{{user | displayName}}</div>
+┊  ┊20┊      <button (click)="invite(user)">Invite</button>
+┊  ┊21┊    </li>
+┊  ┊22┊  </ul>
+┊  ┊23┊</div>
 ┊22┊24┊
-┊23┊  ┊<div>
+┊  ┊25┊<div *ngIf="isInvited">
 ┊24┊26┊  <h2>Reply to the invitation</h2>
 ┊25┊27┊  <input type="button" value="I'm going!" (click)="reply('yes')">
 ┊26┊28┊  <input type="button" value="Maybe" (click)="reply('maybe')">
```
[}]: #

# Summary

In this step we've become familiar with the binding to the DOM attributes in Angular 2 and
used two of the attributes to make our app better: `hidden` and `disabled`.

The difference between `ngIf` and `hidden` was highlighted, and based on that, `ngIf`
was used to make the party details page securer and visually better.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step15.md) | [Next Step >](step17.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #