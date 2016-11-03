In this step, you will learn:

-  how to create a layout template
-  how to build an app that has multiple views with the new Angular router.

The goal for this step is to add one more page to the app that shows the details of the selected party.

By default we have a list of parties shown on the page, but when a user clicks on a list item, the app should navigate to the new page and show selected party details.


## Parties List

Since we want to have multiple views in our app we have to move the current list of parties into the separate component.

Let's move the content of AppComponent in `app.component.ts` out into a `PartiesList` component.

Create a new file called `parties-list.component.ts` and put it in `client/imports/app/parties` directory.

{{{diff_step 6.1}}}

There are few things we did in that step:

- Updated path of the module with `Parties` collection
- Changed the name of the template
- Used `parties-list` as the selector instead of `app`
- Renamed the class

Now we can copy `app.component.html` into the `parties` directory and rename it `parties-list.component.html`:

{{{diff_step 6.2}}}

Also, let's clean-up `app.component.ts` to prepare it for the next steps:

{{{diff_step 6.3}}}

and the template for it, which is `app.component.html`:

> You will notice that the interface of your app has disappeared. But don't worry! It will come back later on.

{{{diff_step 6.4}}}

And let's add the new Component to the index file:

{{{diff_step 6.5}}}

# Routing


`@angular/router` is the package in charge of Routing in Angular 2, and we will learn how to use it now.

This package provides utils to define our routes, and get them as `NgModule` object we just include in our application.

**Defining routes**

We need to create an array of route definitions. The `Route` interface comes with help. This way we can be sure that properties of that object are correctly used.

The very basic two properties are `path` and `component`. The path is to define the url and the other one is to bind a component to it.

We will export our routes using `routes` variable.

Let's warp it in the `app.routes.ts` file, here's what it suppose to look like:

{{{diff_step 6.6}}}

Now we can use `routes` in the `NgModule`, with the `RouteModule` provided by Angular 2:

{{{diff_step 6.7}}}

Our app still has to display the view somewhere. We'll use `routerOutlet` component to do this.

{{{diff_step 6.8}}}

Now, because we use a router that based on the browser path and URL - we need to tell Angular 2 router which path is the base path.

We already have it because we used the Angular 2 boilerplate, but if you are looking for it - you can find it in `client/index.html` file:

    <base href="/">

# Parties details

Let's add another view to the app: `PartyDetailsComponent`. Since it's not possible yet to get party details in this component, we are only going to make stubs.

When we're finished, clicking on a party in the list should redirect us to the PartyDetailsComponent for more information.

{{{diff_step 6.9}}}

And add a simple template outline for the party details:

{{{diff_step 6.10}}}

And let's add the new Component to the index file:

{{{diff_step 6.11 client/imports/app/parties/index.ts}}}

Now we can define the route:

{{{diff_step 6.11 client/imports/app/app.routes.ts}}}

As you can see, we used `:partyId` inside of the path string. This way we define parameters. For example, `localhost:3000/party/12` will point to the PartyDetailsComponent with `12` as the value of the `partyId` parameter.

We still have to add a link that redirects to party details.

# RouterLink

Let's add links to the new router details view from the list of parties.

As we've already seen, each party link consists of two parts: the base `PartyDetailsComponent` URL and a party ID, represented by the `partyId` in the configuration. There is a special directive called `routerLink` that will help us to compose each URL.

Now we can wrap our party in a `routerLink` and pass in the _id as a parameter. Note that the id is auto-generated when an item is inserted into a Mongo Collection.

{{{diff_step 6.12}}}

As you can see, we used an array. The first element is a path that we want to use and the next one is to provide a value of a parameter.

> You can provide more than one parameter by adding more elements into an array.

# Injecting Route Params

We've just added links to the `PartyDetails` view.

The next thing is to grab the `partyId` route parameter in order to load the correct party in the `PartyDetails` view.

In Angular 2, it's as simple as passing the `ActivatedRoute` argument to the `PartyDetails` constructor:

{{{diff_step 6.13}}}

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

{{{diff_step 6.14}}}

Now, we need to get the actual `Party` object with the ID we got from the Router, so let's use the `Parties` collection to get it:

{{{diff_step 6.15}}}

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
