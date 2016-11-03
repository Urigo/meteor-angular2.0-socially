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

{{{diff_step 13.1}}}

On the client side, we are going to define three additional variables in the `PartiesList` component which our pagination will depend on:
page size, current page number and name sort order.
Secondly, we'll create a special _options_ object made up of these variables and pass it to the parties subscription:

{{{diff_step 13.2}}}

As was said before, we also need to query `Parties` on the client side with same parameters and options as we used on the server, i.e., parameters and options we pass to the server side.

In reality, though, we don't need _skip_ and _limit_ options in this case, since the subscription result of the parties collection will always have a maximum page size of documents on the client.

So, we will only add sorting:

{{{diff_step 13.3}}}

### Reactive Changes

The idea behind Reactive variables and changes - is to update our Meteor subscription according to the user interaction - for example: if the user changes the sort order - we want to drop the old Meteor subscription and replace it with a new one that matches the new parameters.

Because we are using RxJS, we can create variables that are `Observable`s - which means we can register to the changes notification - and act as required - in our case - changed the Meteor subscription.

In order to do so, we will use RxJS `Subject` - which is an extension for `Observable`.

A `Subject` is a sort of bridge or proxy that is available in some implementations of RxJS that acts both as an observer and as an Observable.

Which means we can both register to the updates notifications and trigger the notification!

In our case - when the user changes the parameters of the Meteor subscription, we need to trigger the notification.

So let's do it. We will replace the regular variables with `Subject`s, and in order to trigger the notification in the first time, we will execute `next()` for the `Subject`s:

{{{diff_step 13.4}}}

Now we need to register to those changes notifications.

Because we need to register to multiple notifications (page size, current page, sort), we need to use a special RxJS Operator called `combineLatest` - which combines multiple `Observable`s into one, and trigger a notification when one of them changes!

So let's use it and update the subscription:

{{{diff_step 13.5}}}

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

{{{diff_step 13.7}}}

Because of pagination pipe of ng2-pagination supports only arrays we'll use the `PaginationService`.
Let's define the configuration:

{{{diff_step 13.8}}}

> `id` - this is the identifier of specific pagination, we use the default.

We need to notify the pagination that the current page has been changed, so let's add it to the method where we handle the reactive changes:

{{{diff_step 13.9}}}

Now, add the pagination controls to the `parties-list.component.html` template:

{{{diff_step 13.10}}}

In the configuration, we provided the current page number, the page size and a new value of total items in the list to paginate.

This total number of items are required to be set in our case, since we don't provide a
regular array of elements but instead an `Observable`, the pagination service simply won't know how to calculate its size.

We'll get back to this in the next paragraph where we'll be setting parties total size reactively.

For now, let's just set it to be 30. We'll see why this default value is needed shortly.

### pageChange events

The final part is to handle user clicks on the page links. The pagination controls component
fires a special event when the user clicks on a page link, causing the current page to update.

Let's handle this event in the template first and then add a method to the `PartiesList` component itself:

{{{diff_step 13.11}}}

As you can see, the pagination controls component fires the `pageChange` event, calling the `onPageChanged` method with
a special event object that contains the new page number to set. Add the `onPageChanged` method:

{{{diff_step 13.12}}}

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

{{{diff_step 13.15}}}

This package exports a `Counts` object with all of the API methods we will need.

> Notice that you'll see a TypeScript warning in the terminal
> saying that "Counts" has no method you want to use, when you start using the API.
> You can remove this warning by adding a [publish-counts type declaration file](https://github.com/correpw/meteor-publish-counts.d.ts/blob/master/Counts.d.ts) to your typings.

Let's publish the total number of parties as follows:

{{{diff_step 13.14}}}

> Notice that we are passing `{ noReady: true }` in the last argument so
> that the publication will be ready only after our main cursor is loaded, instead of waiting for Counts.

We've just created the new _numberOfParties_ publication.
Let's get it reactively on the client side using the `Counts` object, and, at the same time,
introduce a new `partiesSize` property in the `PartiesList` component:

{{{diff_step 13.16}}}

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

{{{diff_step 13.17}}}

In the `PartiesList` component, we change the `nameOrder` property to be a reactive variable and add a `changeSortOrder` event handler, where we set the new sort order:

{{{diff_step 13.18}}}

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

{{{diff_step 13.19}}}

On the client side, we are going to add a new reactive variable and set it to update when a user clicks on the search button:

{{{diff_step 13.20}}}

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
