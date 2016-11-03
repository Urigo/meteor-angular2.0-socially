[{]: <region> (header)
# Step 3: Dynamic Template
[}]: #
[{]: <region> (body)
Now it's time to make the web page dynamic — with Angular 2.

This step will still be focusing on client side Angular tools. The next one will show you how to get the full stack power of Meteor.

# Data in the View

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

[{]: <helper> (diff_step 3.1)
#### Step 3.1: Add dynamic html to the App component

##### Changed client/imports/app/app.component.html
```diff
@@ -1,14 +1,9 @@
-┊ 1┊  ┊<ul>
-┊ 2┊  ┊  <li>
-┊ 3┊  ┊    <span>Dubstep-Free Zone</span>
-┊ 4┊  ┊    <p>
-┊ 5┊  ┊      Can we please just for an evening not listen to dubstep.
-┊ 6┊  ┊    </p>
-┊ 7┊  ┊  </li>
-┊ 8┊  ┊  <li>
-┊ 9┊  ┊    <span>All dubstep all the time</span>
-┊10┊  ┊    <p>
-┊11┊  ┊      Get it on!
-┊12┊  ┊    </p>
-┊13┊  ┊  </li>
-┊14┊  ┊</ul>🚫↵
+┊  ┊ 1┊<div>
+┊  ┊ 2┊  <ul>
+┊  ┊ 3┊    <li *ngFor="let party of parties">
+┊  ┊ 4┊      {{party.name}}
+┊  ┊ 5┊      <p>{{party.description}}</p>
+┊  ┊ 6┊      <p>{{party.location}}</p>
+┊  ┊ 7┊    </li>
+┊  ┊ 8┊  </ul>
+┊  ┊ 9┊</div>🚫↵
```
[}]: #

We replaced the hard-coded party list with the [NgFor](https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html) directive and two Angular expressions:

- The `*ngFor="let party of parties"` attribute in the `li` tag is an Angular repeater directive. The repeater tells Angular to create a `li` element for each party in the list using the `li` tag as the template.
- The expressions wrapped in the double curly braces ( `{{party.name}}` and `{{party.description}}` ) will be replaced by the value of the expressions.

Angular 2 has _common_ directives that provide additional functionality to HTML. These include `ngFor`, `ngIf`, `ngClass`, _form_ directives (which will be heavily used on the 4th step) and more found in the [`@angular/common`](https://angular.io/docs/ts/latest/api/common/) package. Those common directives are globally available in every component template so you don't need to import them manually into the component's view, in comparison to a custom directive or routing directives.

# Component data

Now we are going to create our initial data model and render it in the view.
This code will go inside of our `AppComponent` class [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor). A constructor is a function that runs when a class is loaded, thus it loads the initial data for the class.

We can attach data with the context `this`, referring to the `AppComponent` class:

[{]: <helper> (diff_step 3.2)
#### Step 3.2: Load parties data into app

##### Changed client/imports/app/app.component.ts
```diff
@@ -6,4 +6,23 @@
 ┊ 6┊ 6┊  selector: 'app',
 ┊ 7┊ 7┊  template
 ┊ 8┊ 8┊})
-┊ 9┊  ┊export class AppComponent {}
+┊  ┊ 9┊export class AppComponent {
+┊  ┊10┊  parties: any[];
+┊  ┊11┊
+┊  ┊12┊  constructor() {
+┊  ┊13┊    this.parties = [
+┊  ┊14┊      {'name': 'Dubstep-Free Zone',
+┊  ┊15┊        'description': 'Can we please just for an evening not listen to dubstep.',
+┊  ┊16┊        'location': 'Palo Alto'
+┊  ┊17┊      },
+┊  ┊18┊      {'name': 'All dubstep all the time',
+┊  ┊19┊        'description': 'Get it on!',
+┊  ┊20┊        'location': 'Palo Alto'
+┊  ┊21┊      },
+┊  ┊22┊      {'name': 'Savage lounging',
+┊  ┊23┊        'description': 'Leisure suit required. And only fiercest manners.',
+┊  ┊24┊        'location': 'San Francisco'
+┊  ┊25┊      }
+┊  ┊26┊    ];
+┊  ┊27┊  }
+┊  ┊28┊}
```
[}]: #

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
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step2.md) | [Next Step >](step4.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #