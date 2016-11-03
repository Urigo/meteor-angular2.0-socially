Now it's time to make the web page dynamic — with Angular 2.

This step will still be focusing on client side Angular tools. The next one will show you how to get the full stack power of Meteor.

# Data in the View

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

{{{diff_step 3.1}}}

We replaced the hard-coded party list with the [NgFor](https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html) directive and two Angular expressions:

- The `*ngFor="let party of parties"` attribute in the `li` tag is an Angular repeater directive. The repeater tells Angular to create a `li` element for each party in the list using the `li` tag as the template.
- The expressions wrapped in the double curly braces ( `\{{party.name}}` and `\{{party.description}}` ) will be replaced by the value of the expressions.

Angular 2 has _common_ directives that provide additional functionality to HTML. These include `ngFor`, `ngIf`, `ngClass`, _form_ directives (which will be heavily used on the 4th step) and more found in the [`@angular/common`](https://angular.io/docs/ts/latest/api/common/) package. Those common directives are globally available in every component template so you don't need to import them manually into the component's view, in comparison to a custom directive or routing directives.

# Component data

Now we are going to create our initial data model and render it in the view.
This code will go inside of our `AppComponent` class [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor). A constructor is a function that runs when a class is loaded, thus it loads the initial data for the class.

We can attach data with the context `this`, referring to the `AppComponent` class:

{{{diff_step 3.2}}}

Run the app again.

    $ meteor

You'll see the data model, parties, is now instantiated within the `AppComponent` component.

As you probably noticed, we defined `parties` with a `any[]`. Little disclaimer. That's a TypeScript specific thing and it's called Type.

What `parties: any[]` means? It tells to your IDE and TypeScript compiler that `parties` property is an array of any value. It could be an Object, Number etc.

In one of next chapters we will explain to you a lot more about [Types](http://www.typescriptlang.org/Handbook#basic-types).

Without this your IDE or console would say something like:

    client/app.ts (13, 8): Property 'parties' does not exist on type 'AppComponent'.

Although we haven't done much, we connected the dots between the presentation, the data, and the business logic.

# Summary

You now have a dynamic app that features a full component.

But, this is still all client side — which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

So, let's go to [step 3](/tutorials/angular2/3-way-data-binding) to learn how to bind our application to the great power of Meteor.