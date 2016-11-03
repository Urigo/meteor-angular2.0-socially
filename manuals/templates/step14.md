In this and next steps we are going to:

- add party invitations;
- filter data with Angular2 pipes
- learn about Meteor methods

# Rendering Users

We'll start by working on the `PartyDetails` component. Each party owner should be able to invite multiple guests to a party, hence, the user needs to be able to manipulate the data on the party details page.

First of all, we'll need to render a list of all users to invite on the page. Since we've made the app secure during step 8 by removing the _insecure_ package, to get a list of users — the same as for the parties — we'll need to create a new publication, and then subscribe to load the user collection.

Let's create a new file `server/imports/publications/users.ts` and add a new publication there. We can start by finding all uninvited users, specifically, users who are not invited and not the current user.

{{{diff_step 14.1}}}

Notice that we've made use of a special Mongo selector [`$nin`](https://docs.mongodb.org/manual/reference/operator/query/nin/),
meaning "not in", to sift out users that have already been invited to this party so far.
We used [`$ne`](https://docs.mongodb.org/manual/reference/operator/query/ne/) to select ids
that are "not equal" to the user's id.

As you can see above, we've introduced a new party property — "invited", which is going to be an array of all invited user IDs.

Now, let's update the Party interface to contain the new field:

{{{diff_step 14.2}}}

Next, import the users publication to be defined on the server during startup:

{{{diff_step 14.3}}}

Now, let's create a new Collection with RxJS support for the users collection. Meteor have a built-in users collection, so we just need to wrap it using `MongoObservable.fromExisting`:

{{{diff_step 14.4}}}

And let's create an interface for the User object:

{{{diff_step 14.5}}}

Then, let's load the uninvited users of a particular party into the `PartyDetails` component.

We will use `MeteorObservable.subscribe` to subscribe to the data, and we use `.find` on the `Users` collection in order to fetch the user's details:

{{{diff_step 14.6}}}

Now, render the uninvited users on the `PartyDetails`'s page:

{{{diff_step 14.7}}}

> Remember? we use `async` Pipe because we use RxJS `Observable`

# Implementing Pipes

In the previous section we rendered a list of user emails. In Meteor's [accounts package](http://docs.meteor.com/#/full/accounts_api) an email is considered a primary user ID by default. At the same time, everything is configurable, which means there is way for a user to set a custom username to be identified with during the registration. Considering usernames are more visually appealing than emails, let's render them instead of emails in that list of uninvited users checking if the name is set for each user.

For that purpose we could create a private component method and call it each time in the template to get the right display name, i.e., username or email. Instead, we'll implement a special pipe that handles this, at the same time, we'll learn how to create stateless pipes. One of the advantages of this approach in comparison to class methods is that we can use the same pipe in any component. You can read [the docs](https://angular.io/docs/ts/latest/guide/pipes.html) to know more about Angular2 Pipes.

Let's add a new folder "client/imports/app/shared" and place a new file `display-name.pipe.ts`. We'll add our new `displayName` pipe inside of it:

{{{diff_step 14.8}}}

As you can see, there are a couple of things to remember in order to create a pipe:

- define a class that implements the `PipeTransform` interface, with an implemented method `transform` inside
- place pipe metadata upon this class with the help of the `@Pipe` decorator to notify Angular 2 that this class essentially is a pipe

Now, in order to use this Pipe, we need to declare it in the `NgModule`, so first let's create an index file for all of the shared declarations:

{{{diff_step 14.9}}}

And import the exposed Array in our `NgModule` definition:

{{{diff_step 14.10}}}

To make use of the created pipe, change the markup of the `PartyDetails`'s template to:

{{{diff_step 14.11}}}

If you were familiar with Angular 1's filters concept, you might believe that Angular 2's pipes are very similar. This is both true and not. While the view syntax and aims they are used for are the same, there are some important differences. The main one is that Angular 2 can now efficiently handle _stateful_ pipes, whereas stateful filters were discouraged in Angular 1. Another thing to note is that Angular 2 pipes are defined in the unique and elegant Angular 2 way, i.e., using classes and class metadata, the same as for components and their views.

# Challenge

In order to cement our knowledge of using pipes, try to create a current user status pipe, which transforms the current user in a party to one of three values: owner, invited and uninvited. This will be helpful in the next step, where we'll get to the implementation of the invitation feature and will change the current UI for improved security.

# Summary

In this step, we learned about:

- how to implement pipes in Angular 2, and how they different from filters in Angular 1
- configuring our accounts-ui package
- some Mongo query operators like `$nin` & `$ne`

In the next step we'll look at using Meteor methods as a way to securely verify client-side data changes on the server.
