[{]: <region> (header)
# Step 14: Using and creating AngularJS filters
[}]: #
[{]: <region> (body)
In this and next steps we are going to:

- add party invitations;
- filter data with Angular2 pipes
- learn about Meteor methods

# Rendering Users

We'll start by working on the `PartyDetails` component. Each party owner should be able to invite multiple guests to a party, hence, the user needs to be able to manipulate the data on the party details page.

First of all, we'll need to render a list of all users to invite on the page. Since we've made the app secure during step 8 by removing the _insecure_ package, to get a list of users — the same as for the parties — we'll need to create a new publication, and then subscribe to load the user collection.

Let's create a new file `server/imports/publications/users.ts` and add a new publication there. We can start by finding all uninvited users, specifically, users who are not invited and not the current user.

[{]: <helper> (diff_step 14.1)
#### Step 14.1: Add uninvited users publication

##### Added server/imports/publications/users.ts
```diff
@@ -0,0 +1,18 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊
+┊  ┊ 3┊import { Parties } from '../../../both/collections/parties.collection';
+┊  ┊ 4┊
+┊  ┊ 5┊Meteor.publish('uninvited', function (partyId: string) {
+┊  ┊ 6┊  const party = Parties.findOne(partyId);
+┊  ┊ 7┊
+┊  ┊ 8┊  if (!party) {
+┊  ┊ 9┊    throw new Meteor.Error('404', 'No such party!');
+┊  ┊10┊  }
+┊  ┊11┊
+┊  ┊12┊  return Meteor.users.find({
+┊  ┊13┊    _id: {
+┊  ┊14┊      $nin: party.invited || [],
+┊  ┊15┊      $ne: this.userId
+┊  ┊16┊    }
+┊  ┊17┊  });
+┊  ┊18┊});
```
[}]: #

Notice that we've made use of a special Mongo selector [`$nin`](https://docs.mongodb.org/manual/reference/operator/query/nin/),
meaning "not in", to sift out users that have already been invited to this party so far.
We used [`$ne`](https://docs.mongodb.org/manual/reference/operator/query/ne/) to select ids
that are "not equal" to the user's id.

As you can see above, we've introduced a new party property — "invited", which is going to be an array of all invited user IDs.

Now, let's update the Party interface to contain the new field:

[{]: <helper> (diff_step 14.2)
#### Step 14.2: Add invited to Party interface

##### Changed both/models/party.model.ts
```diff
@@ -6,4 +6,5 @@
 ┊ 6┊ 6┊  location: string;
 ┊ 7┊ 7┊  owner?: string;
 ┊ 8┊ 8┊  public: boolean;
+┊  ┊ 9┊  invited?: string[];
 ┊ 9┊10┊}
```
[}]: #

Next, import the users publication to be defined on the server during startup:

[{]: <helper> (diff_step 14.3)
#### Step 14.3: Use it on the server

##### Changed server/main.ts
```diff
@@ -2,7 +2,8 @@
 ┊2┊2┊
 ┊3┊3┊import { loadParties } from './imports/fixtures/parties';
 ┊4┊4┊
-┊5┊ ┊import './imports/publications/parties'; 
+┊ ┊5┊import './imports/publications/parties';
+┊ ┊6┊import './imports/publications/users'; 
 ┊6┊7┊
 ┊7┊8┊Meteor.startup(() => {
 ┊8┊9┊  loadParties();
```
[}]: #

Now, let's create a new Collection with RxJS support for the users collection. Meteor have a built-in users collection, so we just need to wrap it using `MongoObservable.fromExisting`:

[{]: <helper> (diff_step 14.4)
#### Step 14.4: Create Users collection from Meteor.users

##### Added both/collections/users.collection.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊
+┊ ┊4┊export const Users = MongoObservable.fromExisting(Meteor.users);
```
[}]: #

And let's create an interface for the User object:

[{]: <helper> (diff_step 14.5)
#### Step 14.5: Create also User interface

##### Added both/models/user.model.ts
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊
+┊ ┊3┊export interface User extends Meteor.User {}
```
[}]: #

Then, let's load the uninvited users of a particular party into the `PartyDetails` component.

We will use `MeteorObservable.subscribe` to subscribe to the data, and we use `.find` on the `Users` collection in order to fetch the user's details:

[{]: <helper> (diff_step 14.6)
#### Step 14.6: Implement subscription of uninvited users

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { ActivatedRoute } from '@angular/router';
+┊ ┊3┊import { Observable } from 'rxjs/Observable';
 ┊3┊4┊import { Subscription } from 'rxjs/Subscription';
 ┊4┊5┊import { Meteor } from 'meteor/meteor';
 ┊5┊6┊import { MeteorObservable } from 'meteor-rxjs';
```
```diff
@@ -8,6 +9,8 @@
 ┊ 8┊ 9┊
 ┊ 9┊10┊import { Parties } from '../../../../both/collections/parties.collection';
 ┊10┊11┊import { Party } from '../../../../both/models/party.model';
+┊  ┊12┊import { Users } from '../../../../both/collections/users.collection';
+┊  ┊13┊import { User } from '../../../../both/models/user.model';
 ┊11┊14┊
 ┊12┊15┊import template from './party-details.component.html';
 ┊13┊16┊
```
```diff
@@ -20,6 +23,8 @@
 ┊20┊23┊  paramsSub: Subscription;
 ┊21┊24┊  party: Party;
 ┊22┊25┊  partySub: Subscription;
+┊  ┊26┊  users: Observable<User>;
+┊  ┊27┊  uninvitedSub: Subscription;
 ┊23┊28┊
 ┊24┊29┊  constructor(
 ┊25┊30┊    private route: ActivatedRoute
```
```diff
@@ -38,6 +43,18 @@
 ┊38┊43┊        this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
 ┊39┊44┊          this.party = Parties.findOne(this.partyId);
 ┊40┊45┊        });
+┊  ┊46┊
+┊  ┊47┊        if (this.uninvitedSub) {
+┊  ┊48┊          this.uninvitedSub.unsubscribe();
+┊  ┊49┊        }
+┊  ┊50┊
+┊  ┊51┊        this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.partyId).subscribe(() => {
+┊  ┊52┊           this.users = Users.find({
+┊  ┊53┊             _id: {
+┊  ┊54┊               $ne: Meteor.userId()
+┊  ┊55┊              }
+┊  ┊56┊            }).zone();
+┊  ┊57┊        });
 ┊41┊58┊      });
 ┊42┊59┊  }
 ┊43┊60┊
```
```diff
@@ -59,5 +76,6 @@
 ┊59┊76┊  ngOnDestroy() {
 ┊60┊77┊    this.paramsSub.unsubscribe();
 ┊61┊78┊    this.partySub.unsubscribe();
+┊  ┊79┊    this.uninvitedSub.unsubscribe();
 ┊62┊80┊  }
 ┊63┊81┊}
```
[}]: #

Now, render the uninvited users on the `PartyDetails`'s page:

[{]: <helper> (diff_step 14.7)
#### Step 14.7: Display list of uninvited users

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -10,4 +10,11 @@
 ┊10┊10┊
 ┊11┊11┊  <button type="submit">Save</button>
 ┊12┊12┊  <a [routerLink]="['/']">Cancel</a>
-┊13┊  ┊</form>🚫↵
+┊  ┊13┊</form>
+┊  ┊14┊
+┊  ┊15┊<p>Users to invite:</p>
+┊  ┊16┊<ul>
+┊  ┊17┊  <li *ngFor="let user of users | async">
+┊  ┊18┊    <div>{{user.emails[0].address}}</div>
+┊  ┊19┊  </li>
+┊  ┊20┊</ul>
```
[}]: #

> Remember? we use `async` Pipe because we use RxJS `Observable`

# Implementing Pipes

In the previous section we rendered a list of user emails. In Meteor's [accounts package](http://docs.meteor.com/#/full/accounts_api) an email is considered a primary user ID by default. At the same time, everything is configurable, which means there is way for a user to set a custom username to be identified with during the registration. Considering usernames are more visually appealing than emails, let's render them instead of emails in that list of uninvited users checking if the name is set for each user.

For that purpose we could create a private component method and call it each time in the template to get the right display name, i.e., username or email. Instead, we'll implement a special pipe that handles this, at the same time, we'll learn how to create stateless pipes. One of the advantages of this approach in comparison to class methods is that we can use the same pipe in any component. You can read [the docs](https://angular.io/docs/ts/latest/guide/pipes.html) to know more about Angular2 Pipes.

Let's add a new folder "client/imports/app/shared" and place a new file `display-name.pipe.ts`. We'll add our new `displayName` pipe inside of it:

[{]: <helper> (diff_step 14.8)
#### Step 14.8: Create DisplayNamePipe

##### Added client/imports/app/shared/display-name.pipe.ts
```diff
@@ -0,0 +1,25 @@
+┊  ┊ 1┊import { Pipe, PipeTransform } from '@angular/core';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊
+┊  ┊ 4┊import { User } from '../../../../both/models/user.model';
+┊  ┊ 5┊
+┊  ┊ 6┊@Pipe({
+┊  ┊ 7┊  name: 'displayName'
+┊  ┊ 8┊})
+┊  ┊ 9┊export class DisplayNamePipe implements PipeTransform {
+┊  ┊10┊  transform(user: User): string {
+┊  ┊11┊    if (!user) {
+┊  ┊12┊      return '';
+┊  ┊13┊    }
+┊  ┊14┊
+┊  ┊15┊    if (user.username) {
+┊  ┊16┊      return user.username;
+┊  ┊17┊    }
+┊  ┊18┊
+┊  ┊19┊    if (user.emails) {
+┊  ┊20┊      return user.emails[0].address;
+┊  ┊21┊    }
+┊  ┊22┊
+┊  ┊23┊    return '';
+┊  ┊24┊  }
+┊  ┊25┊}
```
[}]: #

As you can see, there are a couple of things to remember in order to create a pipe:

- define a class that implements the `PipeTransform` interface, with an implemented method `transform` inside
- place pipe metadata upon this class with the help of the `@Pipe` decorator to notify Angular 2 that this class essentially is a pipe

Now, in order to use this Pipe, we need to declare it in the `NgModule`, so first let's create an index file for all of the shared declarations:

[{]: <helper> (diff_step 14.9)
#### Step 14.9: Make space for shared declarations

##### Added client/imports/app/shared/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import { DisplayNamePipe } from './display-name.pipe';
+┊ ┊2┊
+┊ ┊3┊export const SHARED_DECLARATIONS: any[] = [
+┊ ┊4┊  DisplayNamePipe
+┊ ┊5┊];
```
[}]: #

And import the exposed Array in our `NgModule` definition:

[{]: <helper> (diff_step 14.10)
#### Step 14.10: Import those declarations to AppModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import { AppComponent } from './app.component';
 ┊ 9┊ 9┊import { routes, ROUTES_PROVIDERS } from './app.routes';
 ┊10┊10┊import { PARTIES_DECLARATIONS } from './parties';
+┊  ┊11┊import { SHARED_DECLARATIONS } from './shared';
 ┊11┊12┊
 ┊12┊13┊@NgModule({
 ┊13┊14┊  imports: [
```
```diff
@@ -20,7 +21,8 @@
 ┊20┊21┊  ],
 ┊21┊22┊  declarations: [
 ┊22┊23┊    AppComponent,
-┊23┊  ┊    ...PARTIES_DECLARATIONS
+┊  ┊24┊    ...PARTIES_DECLARATIONS,
+┊  ┊25┊    ...SHARED_DECLARATIONS
 ┊24┊26┊  ],
 ┊25┊27┊  providers: [
 ┊26┊28┊    ...ROUTES_PROVIDERS
```
[}]: #

To make use of the created pipe, change the markup of the `PartyDetails`'s template to:

[{]: <helper> (diff_step 14.11)
#### Step 14.11: Use this Pipe in PartyDetails

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -15,6 +15,6 @@
 ┊15┊15┊<p>Users to invite:</p>
 ┊16┊16┊<ul>
 ┊17┊17┊  <li *ngFor="let user of users | async">
-┊18┊  ┊    <div>{{user.emails[0].address}}</div>
+┊  ┊18┊    <div>{{user | displayName}}</div>
 ┊19┊19┊  </li>
 ┊20┊20┊</ul>
```
[}]: #

If you were familiar with Angular 1's filters concept, you might believe that Angular 2's pipes are very similar. This is both true and not. While the view syntax and aims they are used for are the same, there are some important differences. The main one is that Angular 2 can now efficiently handle _stateful_ pipes, whereas stateful filters were discouraged in Angular 1. Another thing to note is that Angular 2 pipes are defined in the unique and elegant Angular 2 way, i.e., using classes and class metadata, the same as for components and their views.

# Challenge

In order to cement our knowledge of using pipes, try to create a current user status pipe, which transforms the current user in a party to one of three values: owner, invited and uninvited. This will be helpful in the next step, where we'll get to the implementation of the invitation feature and will change the current UI for improved security.

# Summary

In this step, we learned about:

- how to implement pipes in Angular 2, and how they different from filters in Angular 1
- configuring our accounts-ui package
- some Mongo query operators like `$nin` & `$ne`

In the next step we'll look at using Meteor methods as a way to securely verify client-side data changes on the server.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step13.md) | [Next Step >](step15.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #