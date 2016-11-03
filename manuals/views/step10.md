[{]: <region> (header)
# Step 10: Privacy and publish-subscribe functions
[}]: #
[{]: <region> (body)
You may have noticed that all available parties were always shown on the page
at the time, regardless of whether they had been added by a logged-in user or
anonymously.

In future versions of our app, we'll probably want to have a RSVP feature for parties,
which should only display:

- public parties
- parties the current user has been invited to

In this step we are going to learn how we can restrict data flow from the server side
to the client side for only desired data in Meteor, based on the user currently logged-in and some other parameters.

## Autopublish

First we need to remove the `autopublish` Meteor package.

`autopublish` is added to any new Meteor project.
Like it was mentioned before, it pushes a full copy of the database to each client.
It helped us rapidly develop our app, but it's not so good for privacy...

Write this command in the console:

    meteor remove autopublish

Now run the app. Oops, nothing on the page!

## Meteor.publish

Data in Meteor is published from the server and subscribed to by the client.

We need to tell Meteor what parties we want transferred to the client side.

To do that we will use Meteor's [publish function](http://docs.meteor.com/#/full/meteor_publish).

Publication functions are placed inside the "server" folder so clients won't have access to them.

Let's create a new file inside the "server/imports/publications" folder called `parties.ts`. Here we can specify which parties to pass to the client.

[{]: <helper> (diff_step 10.2)
#### Step 10.2: Publish Parties collection

##### Added server/imports/publications/parties.ts
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Parties } from '../../../both/collections/parties.collection';
+┊ ┊3┊
+┊ ┊4┊Meteor.publish('parties', () => Parties.find());
```
[}]: #

As you can see, parameters of the Meteor.publish are self-explanatory:
first one is a publication name, then there goes a function that returns
a Mongo cursor, which represents a subset of the parties collection
that server will transfer to the client.

The publish function can take parameters as well, but
we'll get to that in a minute.

We've just created a module, as you already know, one necessary thing is left — to import it in the `main.ts` in order to execute code inside:

[{]: <helper> (diff_step 10.3)
#### Step 10.3: Add publication to server-side entry point

##### Changed server/main.ts
```diff
@@ -2,6 +2,8 @@
 ┊2┊2┊
 ┊3┊3┊import { loadParties } from './imports/fixtures/parties';
 ┊4┊4┊
+┊ ┊5┊import './imports/publications/parties'; 
+┊ ┊6┊
 ┊5┊7┊Meteor.startup(() => {
 ┊6┊8┊  loadParties();
 ┊7┊9┊});
```
[}]: #

## Meteor.subscribe

[Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe) is the receiving end of Meteor.publish on the client.

Let's add the following line to subscribe to the `parties` publications:

    MeteorObservable.subscribe('parties').subscribe();

> Note that the first `subscribe` belongs to Meteor API, and the return value in this case is an `Observable` because we used `MeteorObservable`. The second `subscribe` is a method of `Observable`.

> When using `MeteorObservable.subscribe`, the `next` callback called only once - when the subscription is ready to use.

But beyond that simplicity there are two small issues we'll need to solve:

1) Ending a subscription.

Each subscription means that Meteor will continue synchronizing (or in Meteor terms, updating reactively) the particular set of data, we've just subscribed to, between server and client.
If the PartiesList component gets destroyed, we need to inform Meteor to stop that synchronization, otherwise we'll produce a memory leak.

In this case, we will use `OnDestroy` and implement `ngOnDestroy`, and we will use the `Subscription` object returned from our `Observable` - so when the Component is destroyed - the subscription will end.

2) Updating Angular 2's UI

In order to connect Angular 2 and Meteor, we will use a special `Observable` operator called `zone()` - we use it on the Collection query object, so when the collection changes - the view will update.

So, we are going to extend the `PartiesListComponent` component and make use of `MeteorObservable.subscribe`:

[{]: <helper> (diff_step 10.4)
#### Step 10.4: Subscribe to Parties publication

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -1,5 +1,7 @@
-┊1┊ ┊import { Component } from '@angular/core';
+┊ ┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { Observable } from 'rxjs/Observable';
+┊ ┊3┊import { Subscription } from 'rxjs/Subscription';
+┊ ┊4┊import { MeteorObservable } from 'meteor-rxjs';
 ┊3┊5┊
 ┊4┊6┊import { Parties } from '../../../../both/collections/parties.collection';
 ┊5┊7┊import { Party } from '../../../../both/models/party.model';
```
```diff
@@ -10,14 +12,20 @@
 ┊10┊12┊  selector: 'parties-list',
 ┊11┊13┊  template
 ┊12┊14┊})
-┊13┊  ┊export class PartiesListComponent {
+┊  ┊15┊export class PartiesListComponent implements OnInit, OnDestroy {
 ┊14┊16┊  parties: Observable<Party[]>;
+┊  ┊17┊  partiesSub: Subscription;
 ┊15┊18┊
-┊16┊  ┊  constructor() {
+┊  ┊19┊  ngOnInit() {
 ┊17┊20┊    this.parties = Parties.find({}).zone();
+┊  ┊21┊    this.partiesSub = MeteorObservable.subscribe('parties').subscribe();
 ┊18┊22┊  }
 ┊19┊23┊
 ┊20┊24┊  removeParty(party: Party): void {
 ┊21┊25┊    Parties.remove(party._id);
 ┊22┊26┊  }
+┊  ┊27┊
+┊  ┊28┊  ngOnDestroy() {
+┊  ┊29┊    this.partiesSub.unsubscribe();
+┊  ┊30┊  }
 ┊23┊31┊}
```
[}]: #

Now run the app. Whoa, we've just made all the parties come back using pub/sub!

As it's mentioned earlier, it'd be nice for the app to implement some basic security and show parties based on who owns them. Let's do it.

Firstly, we'll add a new `public` field to the party data through several steps:

Add UI with the new "Public" checkbox to the right of the "Location" input;

[{]: <helper> (diff_step 10.5)
#### Step 10.5: Add checkbox for public property

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -7,6 +7,9 @@
 ┊ 7┊ 7┊
 ┊ 8┊ 8┊  <label>Location</label>
 ┊ 9┊ 9┊  <input type="text" formControlName="location">
+┊  ┊10┊
+┊  ┊11┊  <label>Public</label>
+┊  ┊12┊  <input type="checkbox" formControlName="public">
 ┊10┊13┊  
 ┊11┊14┊  <button type="submit">Add</button>
 ┊12┊15┊</form>🚫↵
```
[}]: #

Update Party in `both/models/party.model.ts` to include `public: boolean`;

[{]: <helper> (diff_step 10.6)
#### Step 10.6: Update Party interface

##### Changed both/models/party.model.ts
```diff
@@ -4,5 +4,6 @@
 ┊4┊4┊  name: string;
 ┊5┊5┊  description: string;
 ┊6┊6┊  location: string;
-┊7┊ ┊  owner?: string; 
+┊ ┊7┊  owner?: string;
+┊ ┊8┊  public: boolean;
 ┊8┊9┊}
```
[}]: #

Change the initial data on the server in `parties.ts` to contain the `public` field as well:

[{]: <helper> (diff_step 10.7)
#### Step 10.7: Update parties initials

##### Changed server/imports/fixtures/parties.ts
```diff
@@ -6,15 +6,18 @@
 ┊ 6┊ 6┊    const parties: Party[] = [{
 ┊ 7┊ 7┊      name: 'Dubstep-Free Zone',
 ┊ 8┊ 8┊      description: 'Can we please just for an evening not listen to dubstep.',
-┊ 9┊  ┊      location: 'Palo Alto'
+┊  ┊ 9┊      location: 'Palo Alto',
+┊  ┊10┊      public: true
 ┊10┊11┊    }, {
 ┊11┊12┊      name: 'All dubstep all the time',
 ┊12┊13┊      description: 'Get it on!',
-┊13┊  ┊      location: 'Palo Alto'
+┊  ┊14┊      location: 'Palo Alto',
+┊  ┊15┊      public: true
 ┊14┊16┊    }, {
 ┊15┊17┊      name: 'Savage lounging',
 ┊16┊18┊      description: 'Leisure suit required. And only fiercest manners.',
-┊17┊  ┊      location: 'San Francisco'
+┊  ┊19┊      location: 'San Francisco',
+┊  ┊20┊      public: false
 ┊18┊21┊    }];
 ┊19┊22┊
 ┊20┊23┊    parties.forEach((party: Party) => Parties.insert(party));
```
[}]: #

Now, let's add the public field to our Form declaration:

[{]: <helper> (diff_step 10.8)
#### Step 10.8: Add public property to form builder

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -21,7 +21,8 @@
 ┊21┊21┊    this.addForm = this.formBuilder.group({
 ┊22┊22┊      name: ['', Validators.required],
 ┊23┊23┊      description: [],
-┊24┊  ┊      location: ['', Validators.required]
+┊  ┊24┊      location: ['', Validators.required],
+┊  ┊25┊      public: [false]
 ┊25┊26┊    });
 ┊26┊27┊  }
```
[}]: #

Next, we are limiting data sent to the client. A simple check is to verify that either
the party is public or the "owner" field exists and is equal to the currently logged-in user:

[{]: <helper> (diff_step 10.9)
#### Step 10.9: Limit data sent to the client

##### Changed server/imports/publications/parties.ts
```diff
@@ -1,4 +1,24 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
 ┊ 2┊ 2┊import { Parties } from '../../../both/collections/parties.collection';
 ┊ 3┊ 3┊
-┊ 4┊  ┊Meteor.publish('parties', () => Parties.find());
+┊  ┊ 4┊Meteor.publish('parties', function() {
+┊  ┊ 5┊  const selector = {
+┊  ┊ 6┊    $or: [{
+┊  ┊ 7┊      // party is public
+┊  ┊ 8┊      public: true
+┊  ┊ 9┊    },
+┊  ┊10┊    // or
+┊  ┊11┊    { 
+┊  ┊12┊      // current user is the owner
+┊  ┊13┊      $and: [{
+┊  ┊14┊        owner: this.userId 
+┊  ┊15┊      }, {
+┊  ┊16┊        owner: {
+┊  ┊17┊          $exists: true
+┊  ┊18┊        }
+┊  ┊19┊      }]
+┊  ┊20┊    }]
+┊  ┊21┊  };
+┊  ┊22┊
+┊  ┊23┊  return Parties.find(selector);
+┊  ┊24┊});
```
[}]: #

> `$or`, `$and` and `$exists` names are part of the MongoDB query syntax.
> If you are not familiar with it, please, read about them here: [$or](http://docs.mongodb.org/manual/reference/operator/query/or/), [$and](http://docs.mongodb.org/manual/reference/operator/query/and/) and [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/).

We also need to reset the database since schema of the parties inside is already invalid:

    meteor reset

Let's check to make sure everything is working.

Run the app again, and you will see only two items. That's because we set the third party to be private.

Log in with 2 different users in 2 different browsers. Try to create a couple of public parties and a couple of private ones. Now log out and check out what parties are shown. Only public parties should be visible.

Now log in as a party owner user and verify that a couple of private parties got to the page as well.

## Subscribe with Params

There is one page in our app so far where we'll need parameterized publishing — the `PartyDetails` component's page.
Besides that, let's add another cool feature to Socially, party search by location.

As you already know, the second parameter of Meteor.publish is a callback function that can take a variable number
of parameters, and these parameters are passed by the user to `Meteor.subscribe` on the client.

Let's elaborate our "party" publication on the server. We want to publish both a list of parties and a single party.

[{]: <helper> (diff_step 10.10)
#### Step 10.10: Add party publication

##### Changed server/imports/publications/parties.ts
```diff
@@ -2,7 +2,16 @@
 ┊ 2┊ 2┊import { Parties } from '../../../both/collections/parties.collection';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊Meteor.publish('parties', function() {
-┊ 5┊  ┊  const selector = {
+┊  ┊ 5┊  return Parties.find(buildQuery.call(this));
+┊  ┊ 6┊});
+┊  ┊ 7┊
+┊  ┊ 8┊Meteor.publish('party', function(partyId: string) {
+┊  ┊ 9┊  return Parties.find(buildQuery.call(this, partyId));
+┊  ┊10┊});
+┊  ┊11┊
+┊  ┊12┊
+┊  ┊13┊function buildQuery(partyId?: string): Object {
+┊  ┊14┊  const isAvailable = {
 ┊ 6┊15┊    $or: [{
 ┊ 7┊16┊      // party is public
 ┊ 8┊17┊      public: true
```
```diff
@@ -20,5 +29,16 @@
 ┊20┊29┊    }]
 ┊21┊30┊  };
 ┊22┊31┊
-┊23┊  ┊  return Parties.find(selector);
-┊24┊  ┊});
+┊  ┊32┊  if (partyId) {
+┊  ┊33┊    return {
+┊  ┊34┊      // only single party
+┊  ┊35┊      $and: [{
+┊  ┊36┊          _id: partyId
+┊  ┊37┊        },
+┊  ┊38┊        isAvailable
+┊  ┊39┊      ]
+┊  ┊40┊    };
+┊  ┊41┊  }
+┊  ┊42┊
+┊  ┊43┊  return isAvailable;
+┊  ┊44┊}🚫↵
```
[}]: #

Looks like a lot of code, but it does something powerful. The privacy query, we introduced above, was moved to a separate method called `buildQuery`. We'll need this function to avoid repetition with each different parties query.

> Notice that we used `buildQuery.call(this)` calling syntax in order to make context of this method the same as in Meteor.publish and be able to use `this.userId` inside that method.

Let's subscribe to the new publication in the `PartyDetails` to load one specific party:

[{]: <helper> (diff_step 10.11)
#### Step 10.11: Subscribe to the party publication

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -1,7 +1,8 @@
 ┊1┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { ActivatedRoute } from '@angular/router';
 ┊3┊3┊import { Subscription } from 'rxjs/Subscription';
-┊4┊ ┊import { Meteor } from 'meteor/meteor'; 
+┊ ┊4┊import { Meteor } from 'meteor/meteor';
+┊ ┊5┊import { MeteorObservable } from 'meteor-rxjs';
 ┊5┊6┊
 ┊6┊7┊import 'rxjs/add/operator/map';
 ┊7┊8┊
```
```diff
@@ -18,6 +19,7 @@
 ┊18┊19┊  partyId: string;
 ┊19┊20┊  paramsSub: Subscription;
 ┊20┊21┊  party: Party;
+┊  ┊22┊  partySub: Subscription;
 ┊21┊23┊
 ┊22┊24┊  constructor(
 ┊23┊25┊    private route: ActivatedRoute
```
```diff
@@ -27,9 +29,15 @@
 ┊27┊29┊    this.paramsSub = this.route.params
 ┊28┊30┊      .map(params => params['partyId'])
 ┊29┊31┊      .subscribe(partyId => {
-┊30┊  ┊        this.partyId = partyId
+┊  ┊32┊        this.partyId = partyId;
 ┊31┊33┊        
-┊32┊  ┊        this.party = Parties.findOne(this.partyId);
+┊  ┊34┊        if (this.partySub) {
+┊  ┊35┊          this.partySub.unsubscribe();
+┊  ┊36┊        }
+┊  ┊37┊
+┊  ┊38┊        this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
+┊  ┊39┊          this.party = Parties.findOne(this.partyId);
+┊  ┊40┊        });
 ┊33┊41┊      });
 ┊34┊42┊  }
 ┊35┊43┊
```
```diff
@@ -50,5 +58,6 @@
 ┊50┊58┊
 ┊51┊59┊  ngOnDestroy() {
 ┊52┊60┊    this.paramsSub.unsubscribe();
+┊  ┊61┊    this.partySub.unsubscribe();
 ┊53┊62┊  }
 ┊54┊63┊}
```
[}]: #

We used `MeteorObservable.subscribe` with the parameter we got from the Router params, and do the same logic of OnDestroy.

> Note that in this case, we use the Subscription of the `MeteorObservable.subscribe`, in order to know when the subscription is ready to use, and then we used `findOne` to get the actual object from the Collection.

Run the app and click on one of the party links. You'll see that the party details page loads with full data as before.

# Search

Now it's time for the parties search. Let's add a search input and button to the right of the "Add" button.
We are going to extend the `PartiesList` component since this features is related to the parties list itself:

[{]: <helper> (diff_step 10.12)
#### Step 10.12: Add search input

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,5 +1,8 @@
 ┊1┊1┊<div>
-┊2┊ ┊  <parties-form></parties-form>
+┊ ┊2┊  <parties-form style="float: left"></parties-form>
+┊ ┊3┊  <input type="text" #searchtext placeholder="Search by Location">
+┊ ┊4┊  <button type="button" (click)="search(searchtext.value)">Search</button>
+┊ ┊5┊  
 ┊3┊6┊  <login-buttons></login-buttons>
 ┊4┊7┊
 ┊5┊8┊  <ul>
```
[}]: #

As you may have guessed, the next thing is to process the button click event:

[{]: <helper> (diff_step 10.13)
#### Step 10.13: Add search method

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -25,6 +25,10 @@
 ┊25┊25┊    Parties.remove(party._id);
 ┊26┊26┊  }
 ┊27┊27┊
+┊  ┊28┊  search(value: string): void {
+┊  ┊29┊    this.parties = Parties.find(value ? { location: value } : {}).zone();
+┊  ┊30┊  }
+┊  ┊31┊
 ┊28┊32┊  ngOnDestroy() {
 ┊29┊33┊    this.partiesSub.unsubscribe();
 ┊30┊34┊  }
```
[}]: #

Notice that we don't re-subscribe in the `search` method because we've already loaded all parties available to
the current user from the published parties, so we just query the loaded collection.

# Understanding Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscriptions of the same collection in the client, so adding a different subscription in a different view won't delete the data that is already in the client.

Please, read more about Pub/Sub in Meteor [here](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

In this step we've clearly seen how powerful Meteor and Angular 2 are and how they become even more
powerful when used together. With rather few lines of code, we were able to add full privacy to Socially as well as
search capabilities.

Meanwhile, we've learned about:

- the importance of removing `autopublish`;
- the Publish-Subscribe mechanism in Meteor;
- how to query particular data from the database via the server side.

In the [next step](/tutorials/angular2/deploying-your-app), we'll look at how quick and easy it is to deploy your Meteor app.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step9.md) | [Next Step >](step11.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #