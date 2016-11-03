[{]: <region> (header)
# Step 4: 3-Way Data Binding
[}]: #
[{]: <region> (body)
Now we have a client side application that creates and renders its own data.

So, if we were in any framework other than Meteor, we would likely start implementing a series of REST endpoints to connect the server to the client.
We would also need to create a database and functions to connect to it.

And we haven't even talked about real-time, in which case we would need to add sockets, a local DB for cache and handle latency compensation (or just ignore those features and create a not-so-good or less modern app...)

But luckily, we use Meteor!

# Data Model and Reactivity in Meteor

Meteor makes writing distributed client code as simple as talking to a local database.

Every Meteor client includes an in-memory database cache. To manage the client cache, the server publishes sets of JSON documents, and the client subscribes to these sets. As documents in a set change, the server patches each client's cache automatically.

That introduces us to a new concept — *Full Stack Reactivity*.

In an Angular-ish language we might call it *3 way data binding*.

The way to handle data in Meteor is through the [`Mongo.Collection`](http://docs.meteor.com/#/full/mongo_collection) class. It is used to declare MongoDB collections and manipulate them.

Thanks to [MiniMongo](https://atmospherejs.com/meteor/minimongo), Meteor's client-side Mongo emulator, `Mongo.Collection` can be used from both client and server code.

In short, Meteor core's setup has:

- real-time reactivity through web sockets
- two databases. One on the client for fast changes, another behind the server for official changes
- a special protocol (called DDP) that synchronizes data between two databases
- a bunch of small things that make creating an app with Meteor easier and more developer friendly!

# RxJS and MongoObservable

Angular2-Meteor team also provides an additional package called `meteor-rxjs` which wraps Meteor's original API, and returns RxJs `Observable` instead of using callbacks or promises.

`Observable` is very similar to `Promise`, only it has a continuation flow - which means a multiple `resolve`s.

The lifecycle of `Observable` is built on three parts:

- `next` - called each time the Observable changes.
- `error` - called on error.
- `complete` - calls when the data flow is done.

If we try to connect it to our Meteor world and the world of Mongo Collection, so each time a Collection changes - the `next` callback called, and `complete` should not be called because we are using reactive data and we will always waiting for more updates.

We will use this package instead of Meteor's API, because Angular 2 supports RxJS `Observable`s, and provides great features for those who uses it for their application - starting from iterating on object and a faster change detection.

You can read more about `Observable`s and RxJS [here](http://reactivex.io/documentation/observable.html).

> Note that RxJS documentation might be a little intimidating at the beginning - if you having difficult with it - try to read the examples we use in this tutorials and it's might help you.

# Declare a Collection

So first, let's define our first parties collection that will store all our parties.

We will use `MongoObservable` static methods to declare the Collection:

So add a file `both/collections/parties.collection.ts`

[{]: <helper> (diff_step 4.1)
#### Step 4.1: Add Parties collection

##### Added both/collections/parties.collection.ts
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊
+┊ ┊3┊export const Parties = new MongoObservable.Collection('parties');
```
[}]: #

We've just created a file called `parties.collection.ts`, that contains a CommonJS module called `both/collections/parties`.

This work is done by the TypeScript compiler behind the scenes.

The TypeScript compiler converts `.ts` files to ES5, then registers a CommonJS module with the same name as the relative path to the file in the app.

That's why we use the special word `export`. We are telling CommonJS that we are allowing the object to be exported from this module into the outside world.

Meteor has a series of special folder names, including the `client` folder. All files within a folder named `client` are loaded on the client only. Likewise, files in a folder called `server` are loaded on the server only.

Placing the `both` folder outside of any special folder, makes its contents available to both the client and the server. Therefore, the `parties` collection (and the actions on it) will run on both the client (minimongo) and the server (Mongo).

Though we only declared our model once, we have two modules that declare two versions of our parties collection:
one for client-side and one for server-side. This is often referred to as "isomorphic" or "universal javascript". All synchronization between these two versions of collections is handled by Meteor.

# Binding Meteor to Angular

Now that we've created the collection, our client needs to subscribe to it's changes and bind it to our `this.parties` array.

Because we use `MongoObservable.Collection` instead of regular Meteor Collection, Angular 2 can easily support this type of data object, and iterate it without any modifications.

Let's import the `Parties` from collections:

[{]: <helper> (diff_step 4.2)
#### Step 4.2: Import Parties collection

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import { Component } from '@angular/core';
 ┊2┊2┊
+┊ ┊3┊import { Parties } from '../../../both/collections/parties.collection';
+┊ ┊4┊
 ┊3┊5┊import template from './app.component.html';
 ┊4┊6┊
 ┊5┊7┊@Component({
```
[}]: #

And now we will create a query on our Collection, and because we used `MongoObservable`, the return value of `find` will be a `Observable<any[]>` - which is an `Observable` that contains an array of Objects.

And let's bind to the `Observable`:

[{]: <helper> (diff_step 4.3)
#### Step 4.3: Bind MongoObservable to Angular

##### Changed client/imports/app/app.component.ts
```diff
@@ -1,4 +1,5 @@
 ┊1┊1┊import { Component } from '@angular/core';
+┊ ┊2┊import { Observable } from 'rxjs/Observable';
 ┊2┊3┊
 ┊3┊4┊import { Parties } from '../../../both/collections/parties.collection';
 ┊4┊5┊
```
```diff
@@ -9,22 +10,9 @@
 ┊ 9┊10┊  template
 ┊10┊11┊})
 ┊11┊12┊export class AppComponent {
-┊12┊  ┊  parties: any[];
+┊  ┊13┊  parties: Observable<any[]>;
 ┊13┊14┊
 ┊14┊15┊  constructor() {
-┊15┊  ┊    this.parties = [
-┊16┊  ┊      {'name': 'Dubstep-Free Zone',
-┊17┊  ┊        'description': 'Can we please just for an evening not listen to dubstep.',
-┊18┊  ┊        'location': 'Palo Alto'
-┊19┊  ┊      },
-┊20┊  ┊      {'name': 'All dubstep all the time',
-┊21┊  ┊        'description': 'Get it on!',
-┊22┊  ┊        'location': 'Palo Alto'
-┊23┊  ┊      },
-┊24┊  ┊      {'name': 'Savage lounging',
-┊25┊  ┊        'description': 'Leisure suit required. And only fiercest manners.',
-┊26┊  ┊        'location': 'San Francisco'
-┊27┊  ┊      }
-┊28┊  ┊    ];
+┊  ┊16┊    this.parties = Parties.find({}).zone();
 ┊29┊17┊  }
 ┊30┊18┊}
```
[}]: #

> We used `zone()` method which is a wrapper for the regular `Observable` that do some *Magic* and connects the collection changes into our view using our Component's `Zone`.

Because of that, we now need to add `AsyncPipe`:

[{]: <helper> (diff_step 4.4)
#### Step 4.4: Use AsyncPipe

##### Changed client/imports/app/app.component.html
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊<div>
 ┊2┊2┊  <ul>
-┊3┊ ┊    <li *ngFor="let party of parties">
+┊ ┊3┊    <li *ngFor="let party of parties | async">
 ┊4┊4┊      {{party.name}}
 ┊5┊5┊      <p>{{party.description}}</p>
 ┊6┊6┊      <p>{{party.location}}</p>
```
[}]: #

# Inserting Parties from the Console

At this point we've implemented a rendering of a list of parties on the page.
Now it's time to check if the code above really works; it shouldn't just render that list, but also render all
changes to the database on the page reactively.

In Mongo terminology, items inside collections are called documents. So, let's insert some documents into our collection by using the server database console.

In a new terminal tab, go to your app directory and type:

    meteor mongo

This opens a console into your app's local development database using [Mongo shell](https://docs.mongodb.org/manual/reference/mongo-shell/). At the prompt, type:

    db.parties.insert({ name: "A new party", description: "From the mongo console!", location: "In the DB" });

In your web browser, you will see the UI of your app immediately update to show the new party.
You can see that we didn't have to write any code to connect the server-side database to our front-end code — it just happened automatically.

Insert a few more parties from the database console with different text.

Now let's do the same but with "remove". At the prompt, type the following command to look at all the parties and their properties:

    db.parties.find({});

Choose one party you want to remove and copy its 'id' property.
Then, remove it using that id (replace 'N4KzMEvtm4dYvk2TF' with your party's id value):

    db.parties.remove({"_id": ObjectId("N4KzMEvtm4dYvk2TF")});

Again, you will see the UI of your app immediately updates with that party removed.

Feel free to try running more actions like updating an object from the console, and so on.

# Initializing Data on Server Side

Until now we've been inserting party documents to our collection using the Mongo console.

It would be convenient though to have some initial data pre-loaded into our database.

So, let's initialize our server with the same parties as we had before.

Let's create a file `server/imports/fixtures/parties.ts` and implement `loadParties` method inside to load parties:

[{]: <helper> (diff_step 4.5)
#### Step 4.5: Add initial Parties

##### Added server/imports/fixtures/parties.ts
```diff
@@ -0,0 +1,21 @@
+┊  ┊ 1┊import { Parties } from '../../../both/collections/parties.collection';
+┊  ┊ 2┊
+┊  ┊ 3┊export function loadParties() {
+┊  ┊ 4┊  if (Parties.find().cursor.count() === 0) {
+┊  ┊ 5┊    const parties = [{
+┊  ┊ 6┊      name: 'Dubstep-Free Zone',
+┊  ┊ 7┊      description: 'Can we please just for an evening not listen to dubstep.',
+┊  ┊ 8┊      location: 'Palo Alto'
+┊  ┊ 9┊    }, {
+┊  ┊10┊      name: 'All dubstep all the time',
+┊  ┊11┊      description: 'Get it on!',
+┊  ┊12┊      location: 'Palo Alto'
+┊  ┊13┊    }, {
+┊  ┊14┊      name: 'Savage lounging',
+┊  ┊15┊      description: 'Leisure suit required. And only fiercest manners.',
+┊  ┊16┊      location: 'San Francisco'
+┊  ┊17┊    }];
+┊  ┊18┊
+┊  ┊19┊    parties.forEach((party) => Parties.insert(party));
+┊  ┊20┊  }
+┊  ┊21┊}🚫↵
```
[}]: #

Then create `main.ts` to run this method on Meteor startup:

[{]: <helper> (diff_step 4.6)
#### Step 4.6: Load initial Parties

##### Added server/main.ts
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊
+┊ ┊3┊import { loadParties } from './imports/fixtures/parties';
+┊ ┊4┊
+┊ ┊5┊Meteor.startup(() => {
+┊ ┊6┊  loadParties();
+┊ ┊7┊});
```
[}]: #

To make it fully TypeScript compatible, we need to define `Party` interface:

[{]: <helper> (diff_step 4.7)
#### Step 4.7: Define Party interface

##### Added both/models/party.model.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊export interface Party {
+┊ ┊2┊  name: string;
+┊ ┊3┊  description: string;
+┊ ┊4┊  location: string;
+┊ ┊5┊}
```
[}]: #

And add it in few places:

[{]: <helper> (diff_step 4.8)
#### Step 4.8: Add Party type to Parties collection

##### Changed both/collections/parties.collection.ts
```diff
@@ -1,3 +1,5 @@
 ┊1┊1┊import { MongoObservable } from 'meteor-rxjs';
 ┊2┊2┊
-┊3┊ ┊export const Parties = new MongoObservable.Collection('parties');
+┊ ┊3┊import { Party } from '../models/party.model';
+┊ ┊4┊
+┊ ┊5┊export const Parties = new MongoObservable.Collection<Party>('parties');
```
[}]: #

[{]: <helper> (diff_step 4.9)
#### Step 4.9: Add Party type to data fixtures

##### Changed client/imports/app/app.component.ts
```diff
@@ -2,6 +2,7 @@
 ┊2┊2┊import { Observable } from 'rxjs/Observable';
 ┊3┊3┊
 ┊4┊4┊import { Parties } from '../../../both/collections/parties.collection';
+┊ ┊5┊import { Party } from '../../../both/models/party.model';
 ┊5┊6┊
 ┊6┊7┊import template from './app.component.html';
 ┊7┊8┊
```
```diff
@@ -10,7 +11,7 @@
 ┊10┊11┊  template
 ┊11┊12┊})
 ┊12┊13┊export class AppComponent {
-┊13┊  ┊  parties: Observable<any[]>;
+┊  ┊14┊  parties: Observable<Party[]>;
 ┊14┊15┊
 ┊15┊16┊  constructor() {
 ┊16┊17┊    this.parties = Parties.find({}).zone();
```

##### Changed server/imports/fixtures/parties.ts
```diff
@@ -1,8 +1,9 @@
 ┊1┊1┊import { Parties } from '../../../both/collections/parties.collection';
+┊ ┊2┊import { Party } from '../../../both/models/party.model';
 ┊2┊3┊
 ┊3┊4┊export function loadParties() {
 ┊4┊5┊  if (Parties.find().cursor.count() === 0) {
-┊5┊ ┊    const parties = [{
+┊ ┊6┊    const parties: Party[] = [{
 ┊6┊7┊      name: 'Dubstep-Free Zone',
 ┊7┊8┊      description: 'Can we please just for an evening not listen to dubstep.',
 ┊8┊9┊      location: 'Palo Alto'
```
```diff
@@ -16,6 +17,6 @@
 ┊16┊17┊      location: 'San Francisco'
 ┊17┊18┊    }];
 ┊18┊19┊
-┊19┊  ┊    parties.forEach((party) => Parties.insert(party));
+┊  ┊20┊    parties.forEach((party: Party) => Parties.insert(party));
 ┊20┊21┊  }
 ┊21┊22┊}🚫↵
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #