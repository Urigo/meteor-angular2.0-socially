[{]: <region> (header)
# Step 13: Search, sort, pagination and reactive vars
[}]: #
[{]: <region> (body)
In this step we are going to add:

- parties list pagination
- sorting by party name
- lastly, we will move our previously implemented parties location search to the server side.

Pagination simply means delivering and showing parties to the client on a page-by-page basis,
where each page has a predefined number of items. Pagination reduces the number of documents to be transferred at one time thus decreasing load time. It also increases the usability of the user interface if there are too many documents in the storage.

Besides client-side logic, it usually includes querying a specific page of parties on
the server side to deliver up to the client as well.

# Pagination

First off, we'll add pagination on the server side.

Thanks to the simplicity of the Mongo API combined with Meteor's power, we only need to execute `Parties.find` on the server with some additional parameters. Keep in mind, with Meteor's isomorphic environment, we'll query `Parties` on the client with the same parameters as on the server.

### Mongo Collection query options

`Collection.find` has a convenient second parameter called `options`,
which takes an object for configuring collection querying.
To implement pagination we'll need to provide _sort_, _limit_, and _skip_ fields as `options`.

While  _limit_ and _skip_ set boundaries on the result set, _sort_, at the same time, may not.
We'll use _sort_ to guarantee consistency of our pagination across page changes and page loads,
since Mongo doesn't guarantee any order of documents if they are queried and not sorted.
You can find more information about the _find_ method in Mongo [here](http://docs.meteor.com/#/full/find).

Now, let's go to the `parties` subscription in the `server/imports/publications/parties.ts` file,
add the `options` parameter to the subscription method, and then pass it to `Parties.find`:

[{]: <helper> (diff_step 13.1)
#### Step 13.1: Add options to the parties publication

##### Changed server/imports/publications/parties.ts
```diff
@@ -1,8 +1,12 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
 ┊ 2┊ 2┊import { Parties } from '../../../both/collections/parties.collection';
 ┊ 3┊ 3┊
-┊ 4┊  ┊Meteor.publish('parties', function() {
-┊ 5┊  ┊  return Parties.find(buildQuery.call(this));
+┊  ┊ 4┊interface Options {
+┊  ┊ 5┊  [key: string]: any;
+┊  ┊ 6┊}
+┊  ┊ 7┊
+┊  ┊ 8┊Meteor.publish('parties', function(options: Options) {
+┊  ┊ 9┊  return Parties.find(buildQuery.call(this), options);
 ┊ 6┊10┊});
 ┊ 7┊11┊
 ┊ 8┊12┊Meteor.publish('party', function(partyId: string) {
```
[}]: #

On the client side, we are going to define three additional variables in the `PartiesList` component which our pagination will depend on:
page size, current page number and name sort order.
Secondly, we'll create a special _options_ object made up of these variables and pass it to the parties subscription:

[{]: <helper> (diff_step 13.2)
#### Step 13.2: Define options and use it in the subscription

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -8,6 +8,15 @@
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊import template from './parties-list.component.html';
 ┊10┊10┊
+┊  ┊11┊interface Pagination {
+┊  ┊12┊  limit: number;
+┊  ┊13┊  skip: number;
+┊  ┊14┊}
+┊  ┊15┊
+┊  ┊16┊interface Options extends Pagination {
+┊  ┊17┊  [key: string]: any
+┊  ┊18┊}
+┊  ┊19┊
 ┊11┊20┊@Component({
 ┊12┊21┊  selector: 'parties-list',
 ┊13┊22┊  template
```
```diff
@@ -15,10 +24,20 @@
 ┊15┊24┊export class PartiesListComponent implements OnInit, OnDestroy {
 ┊16┊25┊  parties: Observable<Party[]>;
 ┊17┊26┊  partiesSub: Subscription;
+┊  ┊27┊  pageSize: number = 10;
+┊  ┊28┊  curPage: number = 1;
+┊  ┊29┊  nameOrder: number = 1;
 ┊18┊30┊
 ┊19┊31┊  ngOnInit() {
-┊20┊  ┊    this.parties = Parties.find({}).zone();
-┊21┊  ┊    this.partiesSub = MeteorObservable.subscribe('parties').subscribe();
+┊  ┊32┊    const options: Options = {
+┊  ┊33┊      limit: this.pageSize,
+┊  ┊34┊      skip: (this.curPage - 1) * this.pageSize,
+┊  ┊35┊      sort: { name: this.nameOrder }
+┊  ┊36┊    };
+┊  ┊37┊
+┊  ┊38┊    this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
+┊  ┊39┊      this.parties = Parties.find({}).zone();
+┊  ┊40┊    });
 ┊22┊41┊  }
 ┊23┊42┊
 ┊24┊43┊  removeParty(party: Party): void {
```
[}]: #

As was said before, we also need to query `Parties` on the client side with same parameters and options as we used on the server, i.e., parameters and options we pass to the server side.

In reality, though, we don't need _skip_ and _limit_ options in this case, since the subscription result of the parties collection will always have a maximum page size of documents on the client.

So, we will only add sorting:

[{]: <helper> (diff_step 13.3)
#### Step 13.3: Add sorting by party name to PartiesList

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -36,7 +36,11 @@
 ┊36┊36┊    };
 ┊37┊37┊
 ┊38┊38┊    this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
-┊39┊  ┊      this.parties = Parties.find({}).zone();
+┊  ┊39┊      this.parties = Parties.find({}, {
+┊  ┊40┊        sort: {
+┊  ┊41┊          name: this.nameOrder
+┊  ┊42┊        }
+┊  ┊43┊      }).zone();
 ┊40┊44┊    });
 ┊41┊45┊  }
```
[}]: #

### Reactive Changes

The idea behind Reactive variables and changes - is to update our Meteor subscription according to the user interaction - for example: if the user changes the sort order - we want to drop the old Meteor subscription and replace it with a new one that matches the new parameters.

Because we are using RxJS, we can create variables that are `Observable`s - which means we can register to the changes notification - and act as required - in our case - changed the Meteor subscription.

In order to do so, we will use RxJS `Subject` - which is an extension for `Observable`.

A `Subject` is a sort of bridge or proxy that is available in some implementations of RxJS that acts both as an observer and as an Observable.

Which means we can both register to the updates notifications and trigger the notification!

In our case - when the user changes the parameters of the Meteor subscription, we need to trigger the notification.

So let's do it. We will replace the regular variables with `Subject`s, and in order to trigger the notification in the first time, we will execute `next()` for the `Subject`s:

[{]: <helper> (diff_step 13.4)
#### Step 13.4: Turn primitive values into Subjects

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { Component, OnInit, OnDestroy } from '@angular/core';
 ┊2┊2┊import { Observable } from 'rxjs/Observable';
+┊ ┊3┊import { Subject } from 'rxjs/Subject';
 ┊3┊4┊import { Subscription } from 'rxjs/Subscription';
 ┊4┊5┊import { MeteorObservable } from 'meteor-rxjs';
 ┊5┊6┊
```
```diff
@@ -24,9 +25,9 @@
 ┊24┊25┊export class PartiesListComponent implements OnInit, OnDestroy {
 ┊25┊26┊  parties: Observable<Party[]>;
 ┊26┊27┊  partiesSub: Subscription;
-┊27┊  ┊  pageSize: number = 10;
-┊28┊  ┊  curPage: number = 1;
-┊29┊  ┊  nameOrder: number = 1;
+┊  ┊28┊  pageSize: Subject<number> = new Subject<number>();
+┊  ┊29┊  curPage: Subject<number> = new Subject<number>();
+┊  ┊30┊  nameOrder: Subject<number> = new Subject<number>();
 ┊30┊31┊
 ┊31┊32┊  ngOnInit() {
 ┊32┊33┊    const options: Options = {
```
```diff
@@ -42,6 +43,10 @@
 ┊42┊43┊        }
 ┊43┊44┊      }).zone();
 ┊44┊45┊    });
+┊  ┊46┊
+┊  ┊47┊    this.pageSize.next(10);
+┊  ┊48┊    this.curPage.next(1);
+┊  ┊49┊    this.nameOrder.next(1);
 ┊45┊50┊  }
 ┊46┊51┊
 ┊47┊52┊  removeParty(party: Party): void {
```
[}]: #

Now we need to register to those changes notifications.

Because we need to register to multiple notifications (page size, current page, sort), we need to use a special RxJS Operator called `combineLatest` - which combines multiple `Observable`s into one, and trigger a notification when one of them changes!

So let's use it and update the subscription:

[{]: <helper> (diff_step 13.5)
#### Step 13.5: Re-subscribe on current page changes

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -4,6 +4,8 @@
 ┊ 4┊ 4┊import { Subscription } from 'rxjs/Subscription';
 ┊ 5┊ 5┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import 'rxjs/add/operator/combineLatest';
+┊  ┊ 8┊
 ┊ 7┊ 9┊import { Parties } from '../../../../both/collections/parties.collection';
 ┊ 8┊10┊import { Party } from '../../../../both/models/party.model';
 ┊ 9┊11┊
```
```diff
@@ -28,20 +30,31 @@
 ┊28┊30┊  pageSize: Subject<number> = new Subject<number>();
 ┊29┊31┊  curPage: Subject<number> = new Subject<number>();
 ┊30┊32┊  nameOrder: Subject<number> = new Subject<number>();
+┊  ┊33┊  optionsSub: Subscription;
 ┊31┊34┊
 ┊32┊35┊  ngOnInit() {
-┊33┊  ┊    const options: Options = {
-┊34┊  ┊      limit: this.pageSize,
-┊35┊  ┊      skip: (this.curPage - 1) * this.pageSize,
-┊36┊  ┊      sort: { name: this.nameOrder }
-┊37┊  ┊    };
-┊38┊  ┊
-┊39┊  ┊    this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
-┊40┊  ┊      this.parties = Parties.find({}, {
-┊41┊  ┊        sort: {
-┊42┊  ┊          name: this.nameOrder
-┊43┊  ┊        }
-┊44┊  ┊      }).zone();
+┊  ┊36┊    this.optionsSub = Observable.combineLatest(
+┊  ┊37┊      this.pageSize,
+┊  ┊38┊      this.curPage,
+┊  ┊39┊      this.nameOrder
+┊  ┊40┊    ).subscribe(([pageSize, curPage, nameOrder]) => {
+┊  ┊41┊      const options: Options = {
+┊  ┊42┊        limit: pageSize as number,
+┊  ┊43┊        skip: ((curPage as number) - 1) * (pageSize as number),
+┊  ┊44┊        sort: { name: nameOrder as number }
+┊  ┊45┊      };
+┊  ┊46┊
+┊  ┊47┊      if (this.partiesSub) {
+┊  ┊48┊        this.partiesSub.unsubscribe();
+┊  ┊49┊      }
+┊  ┊50┊      
+┊  ┊51┊      this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
+┊  ┊52┊        this.parties = Parties.find({}, {
+┊  ┊53┊          sort: {
+┊  ┊54┊            name: nameOrder
+┊  ┊55┊          }
+┊  ┊56┊        }).zone();
+┊  ┊57┊      });
 ┊45┊58┊    });
 ┊46┊59┊
 ┊47┊60┊    this.pageSize.next(10);
```
```diff
@@ -59,5 +72,6 @@
 ┊59┊72┊
 ┊60┊73┊  ngOnDestroy() {
 ┊61┊74┊    this.partiesSub.unsubscribe();
+┊  ┊75┊    this.optionsSub.unsubscribe();
 ┊62┊76┊  }
 ┊63┊77┊}
```
[}]: #

> Notice that we also removes the Subscription and use `unsubscribe` because we want to drop the old subscription each time it changes.

# Pagination UI

As this paragraph name suggests, the next logical thing to do would be to implement a
pagination UI, which consists of, at least, a list of page links at the bottom of every page,
so that the user can switch pages by clicking on these links.

Creating a pagination component is not a trivial task and not one of the primary goals of this tutorial,
so we are going to make use of an already existing package with Angular 2 pagination components.
Run the following line to add this package:

    $ meteor npm install ng2-pagination --save

> This package's pagination mark-up follows the structure of
> the [Bootstrap pagination component](http://getbootstrap.com/components/#pagination),
> so you can change its look simply by using proper CSS styles.
> It's worth noting, though, that this package has been created
> with the only this tutorial in mind.
> It misses a lot of features that would be quite useful
> in the real world, for example, custom templates.

Ng2-Pagination consists of three main parts:

- pagination controls that render a list of links
- a pagination service to manipulate logic programmatically
- a pagination pipe component, which can be added in any component template, with the main goal to
transform a list of items according to the current state of the pagination service and show current page of items on UI

First, let's import the pagination module into our `NgModule`:

[{]: <helper> (diff_step 13.7)
#### Step 13.7: Import Ng2PaginationModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 ┊4┊4┊import { RouterModule } from '@angular/router';
 ┊5┊5┊import { AccountsModule } from 'angular2-meteor-accounts-ui';
+┊ ┊6┊import { Ng2PaginationModule } from 'ng2-pagination';
 ┊6┊7┊
 ┊7┊8┊import { AppComponent } from './app.component';
 ┊8┊9┊import { routes, ROUTES_PROVIDERS } from './app.routes';
```
```diff
@@ -14,7 +15,8 @@
 ┊14┊15┊    FormsModule,
 ┊15┊16┊    ReactiveFormsModule,
 ┊16┊17┊    RouterModule.forRoot(routes),
-┊17┊  ┊    AccountsModule
+┊  ┊18┊    AccountsModule,
+┊  ┊19┊    Ng2PaginationModule
 ┊18┊20┊  ],
 ┊19┊21┊  declarations: [
 ┊20┊22┊    AppComponent,
```
[}]: #

Because of pagination pipe of ng2-pagination supports only arrays we'll use the `PaginationService`.
Let's define the configuration:

[{]: <helper> (diff_step 13.8)
#### Step 13.8: Register configuration of pagination

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -3,6 +3,7 @@
 ┊3┊3┊import { Subject } from 'rxjs/Subject';
 ┊4┊4┊import { Subscription } from 'rxjs/Subscription';
 ┊5┊5┊import { MeteorObservable } from 'meteor-rxjs';
+┊ ┊6┊import { PaginationService } from 'ng2-pagination';
 ┊6┊7┊
 ┊7┊8┊import 'rxjs/add/operator/combineLatest';
 ┊8┊9┊
```
```diff
@@ -32,6 +33,10 @@
 ┊32┊33┊  nameOrder: Subject<number> = new Subject<number>();
 ┊33┊34┊  optionsSub: Subscription;
 ┊34┊35┊
+┊  ┊36┊  constructor(
+┊  ┊37┊    private paginationService: PaginationService
+┊  ┊38┊  ) {}
+┊  ┊39┊
 ┊35┊40┊  ngOnInit() {
 ┊36┊41┊    this.optionsSub = Observable.combineLatest(
 ┊37┊42┊      this.pageSize,
```
```diff
@@ -57,6 +62,13 @@
 ┊57┊62┊      });
 ┊58┊63┊    });
 ┊59┊64┊
+┊  ┊65┊    this.paginationService.register({
+┊  ┊66┊      id: this.paginationService.defaultId,
+┊  ┊67┊      itemsPerPage: 10,
+┊  ┊68┊      currentPage: 1,
+┊  ┊69┊      totalItems: 30,
+┊  ┊70┊    });
+┊  ┊71┊
 ┊60┊72┊    this.pageSize.next(10);
 ┊61┊73┊    this.curPage.next(1);
 ┊62┊74┊    this.nameOrder.next(1);
```
[}]: #

> `id` - this is the identifier of specific pagination, we use the default.

We need to notify the pagination that the current page has been changed, so let's add it to the method where we handle the reactive changes:

[{]: <helper> (diff_step 13.9)
#### Step 13.9: Update current page when options change

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -49,6 +49,8 @@
 ┊49┊49┊        sort: { name: nameOrder as number }
 ┊50┊50┊      };
 ┊51┊51┊
+┊  ┊52┊      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);
+┊  ┊53┊
 ┊52┊54┊      if (this.partiesSub) {
 ┊53┊55┊        this.partiesSub.unsubscribe();
 ┊54┊56┊      }
```
[}]: #

Now, add the pagination controls to the `parties-list.component.html` template:

[{]: <helper> (diff_step 13.10)
#### Step 13.10: Add pagination to the list

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -13,4 +13,6 @@
 ┊13┊13┊      <button (click)="removeParty(party)">X</button>
 ┊14┊14┊    </li>
 ┊15┊15┊  </ul>
+┊  ┊16┊
+┊  ┊17┊  <pagination-controls></pagination-controls>
 ┊16┊18┊</div>🚫↵
```
[}]: #

In the configuration, we provided the current page number, the page size and a new value of total items in the list to paginate.

This total number of items are required to be set in our case, since we don't provide a
regular array of elements but instead an `Observable`, the pagination service simply won't know how to calculate its size.

We'll get back to this in the next paragraph where we'll be setting parties total size reactively.

For now, let's just set it to be 30. We'll see why this default value is needed shortly.

### pageChange events

The final part is to handle user clicks on the page links. The pagination controls component
fires a special event when the user clicks on a page link, causing the current page to update.

Let's handle this event in the template first and then add a method to the `PartiesList` component itself:

[{]: <helper> (diff_step 13.11)
#### Step 13.11: Add pageChange event binding

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -14,5 +14,5 @@
 ┊14┊14┊    </li>
 ┊15┊15┊  </ul>
 ┊16┊16┊
-┊17┊  ┊  <pagination-controls></pagination-controls>
+┊  ┊17┊  <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
 ┊18┊18┊</div>🚫↵
```
[}]: #

As you can see, the pagination controls component fires the `pageChange` event, calling the `onPageChanged` method with
a special event object that contains the new page number to set. Add the `onPageChanged` method:

[{]: <helper> (diff_step 13.12)
#### Step 13.12: Add event handler for pageChange

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -84,6 +84,10 @@
 ┊84┊84┊    this.parties = Parties.find(value ? { location: value } : {}).zone();
 ┊85┊85┊  }
 ┊86┊86┊
+┊  ┊87┊  onPageChanged(page: number): void {
+┊  ┊88┊    this.curPage.next(page);
+┊  ┊89┊  }
+┊  ┊90┊
 ┊87┊91┊  ngOnDestroy() {
 ┊88┊92┊    this.partiesSub.unsubscribe();
 ┊89┊93┊    this.optionsSub.unsubscribe();
```
[}]: #

At this moment, we have almost everything in place. Let's check if everything is working.
We are going to have to add a lot of parties, at least, a couple of pages.
But, since we've chosen quite a large default page size (10), it would be tedious to add all parties manually.

### Generating Mock Data

In this example, we need to deal with multiple objects and in order to test it and get the best results - we need a lot of Parties objects.

Thankfully, we have a helpful package called [_anti:fake_](https://atmospherejs.com/anti/fake), which will help us out with the generation of names, locations and other properties of new fake parties.

    $ meteor add anti:fake

So, with the following lines of code we are going to have 30 parties in total
(given that we already have three):

__`server/imports/fixtures/parties.ts`__:

    ...

    for (var i = 0; i < 27; i++) {
      Parties.insert({
        name: Fake.sentence(50),
        location: Fake.sentence(10),
        description: Fake.sentence(100),
        public: true
      });
    }


Fake is loaded in Meteor as a global, you may want to declare it for TypeScript.

You can add it to the end of the `typings.d.ts` file:

    declare var Fake: {
        sentence(words: number): string;
    }

Now reset the database (`meteor reset`) and run the app. You should see a list of 10 parties shown initially and 3 pages links just at the bottom.

Play around with the pagination: click on page links to go back and forth,
then try to delete parties to check if the current page updates properly.


# Getting the Total Number of Parties

The pagination component needs to know how many pages it will create. As such, we need to know the total number of parties in storage and divide it by the number of items per page.

At the same time, our parties collection will always have no more than necessary parties on the client side.
This suggests that we have to add a new publication to publish only the current count of parties existing in storage.

This task looks quite common and, thankfully, it's already been
implemented. We can use the [tmeasday:publish-counts](https://github.com/percolatestudio/publish-counts) package.

    $ meteor add tmeasday:publish-counts

This package is an example for a package that does not provide it's own TypeScript declaration file, so we will have to manually create and add it to the `typings.d.ts` file according to the package API:

[{]: <helper> (diff_step 13.15)
#### Step 13.15: Add declaration of counts package

##### Changed typings.d.ts
```diff
@@ -25,4 +25,15 @@
 ┊25┊25┊declare module '*.sass' {
 ┊26┊26┊  const style: string;
 ┊27┊27┊  export default style;
-┊28┊  ┊}🚫↵
+┊  ┊28┊}
+┊  ┊29┊
+┊  ┊30┊declare module 'meteor/tmeasday:publish-counts' {
+┊  ┊31┊  import { Mongo } from 'meteor/mongo';
+┊  ┊32┊
+┊  ┊33┊  interface CountsObject {
+┊  ┊34┊    get(publicationName: string): number;
+┊  ┊35┊    publish(context: any, publicationName: string, cursor: Mongo.Cursor, options: any): number;
+┊  ┊36┊  }
+┊  ┊37┊
+┊  ┊38┊  export const Counts: CountsObject;
+┊  ┊39┊}
```
[}]: #

This package exports a `Counts` object with all of the API methods we will need.

> Notice that you'll see a TypeScript warning in the terminal
> saying that "Counts" has no method you want to use, when you start using the API.
> You can remove this warning by adding a [publish-counts type declaration file](https://github.com/correpw/meteor-publish-counts.d.ts/blob/master/Counts.d.ts) to your typings.

Let's publish the total number of parties as follows:

[{]: <helper> (diff_step 13.14)
#### Step 13.14: Publish total number of parties

##### Changed server/imports/publications/parties.ts
```diff
@@ -1,4 +1,6 @@
 ┊1┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Counts } from 'meteor/tmeasday:publish-counts';
+┊ ┊3┊
 ┊2┊4┊import { Parties } from '../../../both/collections/parties.collection';
 ┊3┊5┊
 ┊4┊6┊interface Options {
```
```diff
@@ -6,6 +8,8 @@
 ┊ 6┊ 8┊}
 ┊ 7┊ 9┊
 ┊ 8┊10┊Meteor.publish('parties', function(options: Options) {
+┊  ┊11┊  Counts.publish(this, 'numberOfParties', Parties.collection.find(buildQuery.call(this)), { noReady: true });
+┊  ┊12┊
 ┊ 9┊13┊  return Parties.find(buildQuery.call(this), options);
 ┊10┊14┊});
```
[}]: #

> Notice that we are passing `{ noReady: true }` in the last argument so
> that the publication will be ready only after our main cursor is loaded, instead of waiting for Counts.

We've just created the new _numberOfParties_ publication.
Let's get it reactively on the client side using the `Counts` object, and, at the same time,
introduce a new `partiesSize` property in the `PartiesList` component:

[{]: <helper> (diff_step 13.16)
#### Step 13.16: Handle reactive updates of the parties total number

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import { Subscription } from 'rxjs/Subscription';
 ┊ 5┊ 5┊import { MeteorObservable } from 'meteor-rxjs';
 ┊ 6┊ 6┊import { PaginationService } from 'ng2-pagination';
+┊  ┊ 7┊import { Counts } from 'meteor/tmeasday:publish-counts';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊import 'rxjs/add/operator/combineLatest';
 ┊ 9┊10┊
```
```diff
@@ -32,6 +33,8 @@
 ┊32┊33┊  curPage: Subject<number> = new Subject<number>();
 ┊33┊34┊  nameOrder: Subject<number> = new Subject<number>();
 ┊34┊35┊  optionsSub: Subscription;
+┊  ┊36┊  partiesSize: number = 0;
+┊  ┊37┊  autorunSub: Subscription;
 ┊35┊38┊
 ┊36┊39┊  constructor(
 ┊37┊40┊    private paginationService: PaginationService
```
```diff
@@ -68,12 +71,17 @@
 ┊68┊71┊      id: this.paginationService.defaultId,
 ┊69┊72┊      itemsPerPage: 10,
 ┊70┊73┊      currentPage: 1,
-┊71┊  ┊      totalItems: 30,
+┊  ┊74┊      totalItems: this.partiesSize
 ┊72┊75┊    });
 ┊73┊76┊
 ┊74┊77┊    this.pageSize.next(10);
 ┊75┊78┊    this.curPage.next(1);
 ┊76┊79┊    this.nameOrder.next(1);
+┊  ┊80┊
+┊  ┊81┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
+┊  ┊82┊      this.partiesSize = Counts.get('numberOfParties');
+┊  ┊83┊      this.paginationService.setTotalItems(this.paginationService.defaultId, this.partiesSize);
+┊  ┊84┊    });
 ┊77┊85┊  }
 ┊78┊86┊
 ┊79┊87┊  removeParty(party: Party): void {
```
```diff
@@ -91,5 +99,6 @@
 ┊ 91┊ 99┊  ngOnDestroy() {
 ┊ 92┊100┊    this.partiesSub.unsubscribe();
 ┊ 93┊101┊    this.optionsSub.unsubscribe();
+┊   ┊102┊    this.autorunSub.unsubscribe();
 ┊ 94┊103┊  }
 ┊ 95┊104┊}
```
[}]: #

We used `MeteorObservable.autorun` because we wan't to know when there are changes regarding the data that comes from Meteor - so now every change of data, we will calculate the total number of parties and save it in our Component, then we will set it in the `PaginationService`.

Let's verify that the app works the same as before.
Run the app. There should be same three pages of parties.

What's more interesting is to add a couple of new parties, thus, adding
a new 4th page. By this way, we can prove that our new "total number" publication and pagination controls are all working properly.

# Changing Sort Order

It's time for a new cool feature Socially users will certainly enjoy - sorting the parties list by party name.
At this moment, we know everything we need to implement it.

As previously implements, `nameOrder` uses one of two values, 1 or -1, to express ascending and descending orders
respectively. Then, as you can see, we assign `nameOrder` to the party property (currently, `name`) we want to sort.

We'll add a new dropdown UI control with two orders to change, ascending and descending. Let's add it in front of our parties list:

[{]: <helper> (diff_step 13.17)
#### Step 13.17: Add the sort order dropdown

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -5,6 +5,15 @@
 ┊ 5┊ 5┊  
 ┊ 6┊ 6┊  <login-buttons></login-buttons>
 ┊ 7┊ 7┊
+┊  ┊ 8┊  <h1>Parties:</h1>
+┊  ┊ 9┊
+┊  ┊10┊  <div>
+┊  ┊11┊    <select #sort (change)="changeSortOrder(sort.value)">
+┊  ┊12┊      <option value="1" selected>Ascending</option>
+┊  ┊13┊      <option value="-1">Descending</option>
+┊  ┊14┊    </select>
+┊  ┊15┊  </div>
+┊  ┊16┊
 ┊ 8┊17┊  <ul>
 ┊ 9┊18┊    <li *ngFor="let party of parties | async">
 ┊10┊19┊      <a [routerLink]="['/party', party._id]">{{party.name}}</a>
```
[}]: #

In the `PartiesList` component, we change the `nameOrder` property to be a reactive variable and add a `changeSortOrder` event handler, where we set the new sort order:

[{]: <helper> (diff_step 13.18)
#### Step 13.18: Re-subscribe when sort order changes

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -96,6 +96,10 @@
 ┊ 96┊ 96┊    this.curPage.next(page);
 ┊ 97┊ 97┊  }
 ┊ 98┊ 98┊
+┊   ┊ 99┊  changeSortOrder(nameOrder: string): void {
+┊   ┊100┊    this.nameOrder.next(parseInt(nameOrder));
+┊   ┊101┊  }
+┊   ┊102┊
 ┊ 99┊103┊  ngOnDestroy() {
 ┊100┊104┊    this.partiesSub.unsubscribe();
 ┊101┊105┊    this.optionsSub.unsubscribe();
```
[}]: #

> Calling `next` on `nameOrder` Subject, will trigger the change notification - and then the Meteor subscription will re-created with the new parameters!

That's just it! Run the app and change the sort order back and forth.

What's important here is that pagination updates properly, i.e. according to a new sort order.

# Server Side Search

Before this step we had a nice feature to search parties by location, but with the addition of pagination, location search has partly broken. In its current state, there will always be no more than the current page of parties shown simultaneously on the client side. We would like, of course, to search parties across all storage, not just across the current page.

To fix that, we'll need to patch our "parties" and "total number" publications on the server side
to query parties with a new "location" parameter passed down from the client.
Having that fixed, it should work properly in accordance with the added pagination.

So, let's add filtering parties by the location with the help of Mongo's regex API.
It is going to look like this:

[{]: <helper> (diff_step 13.19)
#### Step 13.19: Add search by the party location using regex

##### Changed server/imports/publications/parties.ts
```diff
@@ -7,10 +7,12 @@
 ┊ 7┊ 7┊  [key: string]: any;
 ┊ 8┊ 8┊}
 ┊ 9┊ 9┊
-┊10┊  ┊Meteor.publish('parties', function(options: Options) {
-┊11┊  ┊  Counts.publish(this, 'numberOfParties', Parties.collection.find(buildQuery.call(this)), { noReady: true });
+┊  ┊10┊Meteor.publish('parties', function(options: Options, location?: string) {
+┊  ┊11┊  const selector = buildQuery.call(this, null, location);
 ┊12┊12┊
-┊13┊  ┊  return Parties.find(buildQuery.call(this), options);
+┊  ┊13┊  Counts.publish(this, 'numberOfParties', Parties.collection.find(selector), { noReady: true });
+┊  ┊14┊
+┊  ┊15┊  return Parties.find(selector, options);
 ┊14┊16┊});
 ┊15┊17┊
 ┊16┊18┊Meteor.publish('party', function(partyId: string) {
```
```diff
@@ -18,7 +20,7 @@
 ┊18┊20┊});
 ┊19┊21┊
 ┊20┊22┊
-┊21┊  ┊function buildQuery(partyId?: string): Object {
+┊  ┊23┊function buildQuery(partyId?: string, location?: string): Object {
 ┊22┊24┊  const isAvailable = {
 ┊23┊25┊    $or: [{
 ┊24┊26┊      // party is public
```
```diff
@@ -48,5 +50,13 @@
 ┊48┊50┊    };
 ┊49┊51┊  }
 ┊50┊52┊
-┊51┊  ┊  return isAvailable;
+┊  ┊53┊  const searchRegEx = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };
+┊  ┊54┊
+┊  ┊55┊  return {
+┊  ┊56┊    $and: [{
+┊  ┊57┊        location: searchRegEx
+┊  ┊58┊      },
+┊  ┊59┊      isAvailable
+┊  ┊60┊    ]
+┊  ┊61┊  };
 ┊52┊62┊}🚫↵
```
[}]: #

On the client side, we are going to add a new reactive variable and set it to update when a user clicks on the search button:

[{]: <helper> (diff_step 13.20)
#### Step 13.20: Add reactive search by location

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -35,6 +35,7 @@
 ┊35┊35┊  optionsSub: Subscription;
 ┊36┊36┊  partiesSize: number = 0;
 ┊37┊37┊  autorunSub: Subscription;
+┊  ┊38┊  location: Subject<string> = new Subject<string>();
 ┊38┊39┊
 ┊39┊40┊  constructor(
 ┊40┊41┊    private paginationService: PaginationService
```
```diff
@@ -44,8 +45,9 @@
 ┊44┊45┊    this.optionsSub = Observable.combineLatest(
 ┊45┊46┊      this.pageSize,
 ┊46┊47┊      this.curPage,
-┊47┊  ┊      this.nameOrder
-┊48┊  ┊    ).subscribe(([pageSize, curPage, nameOrder]) => {
+┊  ┊48┊      this.nameOrder,
+┊  ┊49┊      this.location
+┊  ┊50┊    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
 ┊49┊51┊      const options: Options = {
 ┊50┊52┊        limit: pageSize as number,
 ┊51┊53┊        skip: ((curPage as number) - 1) * (pageSize as number),
```
```diff
@@ -58,7 +60,7 @@
 ┊58┊60┊        this.partiesSub.unsubscribe();
 ┊59┊61┊      }
 ┊60┊62┊      
-┊61┊  ┊      this.partiesSub = MeteorObservable.subscribe('parties', options).subscribe(() => {
+┊  ┊63┊      this.partiesSub = MeteorObservable.subscribe('parties', options, location).subscribe(() => {
 ┊62┊64┊        this.parties = Parties.find({}, {
 ┊63┊65┊          sort: {
 ┊64┊66┊            name: nameOrder
```
```diff
@@ -77,6 +79,7 @@
 ┊77┊79┊    this.pageSize.next(10);
 ┊78┊80┊    this.curPage.next(1);
 ┊79┊81┊    this.nameOrder.next(1);
+┊  ┊82┊    this.location.next('');
 ┊80┊83┊
 ┊81┊84┊    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
 ┊82┊85┊      this.partiesSize = Counts.get('numberOfParties');
```
```diff
@@ -89,7 +92,8 @@
 ┊89┊92┊  }
 ┊90┊93┊
 ┊91┊94┊  search(value: string): void {
-┊92┊  ┊    this.parties = Parties.find(value ? { location: value } : {}).zone();
+┊  ┊95┊    this.curPage.next(1);
+┊  ┊96┊    this.location.next(value);
 ┊93┊97┊  }
 ┊94┊98┊
 ┊95┊99┊  onPageChanged(page: number): void {
```
[}]: #

> Notice that we don't know what size to expect from the search
> that's why we are re-setting the current page to 1.

Let's check it out now that everything works properly altogether: pagination, search, sorting,
removing and addition of new parties.

For example, you can try to add 30 parties in a way mentioned slightly above;
then try to remove all 30 parties; then sort by the descending order; then try to search by Palo Alto — it should
find only two, in case if you have not added any other parties rather than used in this tutorial so far;
then try to remove one of the found parties and, finally, search with an empty location.

Although this sequence of actions looks quite complicated, it was accomplished with rather few lines of code.

# Summary

This step covered a lot. We looked at:

- Mongo query sort options: `sort`, `limit`, `skip`
- RxJS `Subject` for updating variables automatically
- Handling onChange events in Angular 2
- Generating fake data with `anti:fake`
- Establishing the total number of results with `tmeasday:publish-counts`
- Enabling server-side searching across an entire collection

In the [next step](/tutorials/angular2/using-and-creating-angularjs-filters) we'll look at sending out our party invitations and look deeper into pipes.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step12.md) | [Next Step >](step14.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #