[{]: <region> (header)
# Step 5: Adding/removing objects and Angular event handling
[}]: #
[{]: <region> (body)
Now that we have full data binding from server to client, let's interact with the data and see the updates in action.

In this chapter we are going to:

- create a new component to add or remove a party
- learn about model-driven forms and create one
- learn how to hook up form events to component methods
- implement adding & removing party event handlers

First, let's create a simple form with a button that will add a new party.

# Component Architecture

In Angular 2, we build a tree of components with the root `App` component and
child components stemming out of it down to the leaves.

Let's make a new component called `PartiesFormComponent`, and put it inside `parties` directory on the client-side (`client/imports/app/parties`).

> Notice that we are placing the file inside the `imports` folder.  
> That is another Meteor special folder name that tells Meteor to load the modules inside it just when some other module is importing it.  

[{]: <helper> (diff_step 5.1)
#### Step 5.1: Create PartiesForm component

##### Added client/imports/app/parties/parties-form.component.ts
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊import { Component } from '@angular/core';
+┊ ┊2┊
+┊ ┊3┊import template from './parties-form.component.html';
+┊ ┊4┊
+┊ ┊5┊@Component({
+┊ ┊6┊  selector: 'parties-form',
+┊ ┊7┊  template
+┊ ┊8┊})
+┊ ┊9┊export class PartiesFormComponent {}
```
[}]: #

Notice that we are exporting the class `PartiesFormComponent` using ES6 module syntax.
As a result, you'll be able to import `PartiesFormComponent` in any other component as follows:

    import { PartiesFormComponent } from 'client/imports/app/parties/parties-form.component';

By exporting and importing different modules, you create a modular structure of your app in ES6,
which is similar to the modules in other script languages like Python.
This is what makes programming in ES6 really awesome since application structure comes out rigid and clear.

Let's add a template for the new component.

Add a file with the following form:

[{]: <helper> (diff_step 5.2)
#### Step 5.2: Create template of PartiesForm

##### Added client/imports/app/parties/parties-form.component.html
```diff
@@ -0,0 +1,12 @@
+┊  ┊ 1┊<form>
+┊  ┊ 2┊  <label>Name</label>
+┊  ┊ 3┊  <input type="text">
+┊  ┊ 4┊
+┊  ┊ 5┊  <label>Description</label>
+┊  ┊ 6┊  <input type="text">
+┊  ┊ 7┊
+┊  ┊ 8┊  <label>Location</label>
+┊  ┊ 9┊  <input type="text">
+┊  ┊10┊  
+┊  ┊11┊  <button>Add</button>
+┊  ┊12┊</form>🚫↵
```
[}]: #

We can load the new `PartiesForm` component on the page by placing the `<parties-form>` tag in the root template `app.html`:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Add PartiesForm to App

##### Changed client/imports/app/app.component.html
```diff
@@ -1,4 +1,6 @@
 ┊1┊1┊<div>
+┊ ┊2┊  <parties-form></parties-form>
+┊ ┊3┊  
 ┊2┊4┊  <ul>
 ┊3┊5┊    <li *ngFor="let party of parties | async">
 ┊4┊6┊      {{party.name}}
```
[}]: #

There is one more required step in Angular 2 to load a component - we need to declare it in the our `NgModule` so other Components know it existing and can use it.

We will create a new file that `export`s an Array of `Component`s that needed to be declared in the `NgModule`:

[{]: <helper> (diff_step 5.4)
#### Step 5.4: Create index for parties with declarations

##### Added client/imports/app/parties/index.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import { PartiesFormComponent } from './parties-form.component';
+┊ ┊2┊
+┊ ┊3┊export const PARTIES_DECLARATIONS = [
+┊ ┊4┊  PartiesFormComponent
+┊ ┊5┊];
```
[}]: #

And now let's load this Array of `Component`s into our `NgModule`:

[{]: <helper> (diff_step 5.5)
#### Step 5.5: Add parties declarations to AppModule

##### Changed client/imports/app/app.module.ts
```diff
@@ -2,13 +2,15 @@
 ┊ 2┊ 2┊import { BrowserModule } from '@angular/platform-browser';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import { AppComponent } from './app.component';
+┊  ┊ 5┊import { PARTIES_DECLARATIONS } from './parties';
 ┊ 5┊ 6┊
 ┊ 6┊ 7┊@NgModule({
 ┊ 7┊ 8┊  imports: [
 ┊ 8┊ 9┊    BrowserModule
 ┊ 9┊10┊  ],
 ┊10┊11┊  declarations: [
-┊11┊  ┊    AppComponent
+┊  ┊12┊    AppComponent,
+┊  ┊13┊    ...PARTIES_DECLARATIONS
 ┊12┊14┊  ],
 ┊13┊15┊  bootstrap: [
 ┊14┊16┊    AppComponent
```
[}]: #

> The `...` is part of ES2016 language - it spreads the array like it was not an array, you can read more about it [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator).

Now we have our parties-form directive showing on our app.

# Angular 2 Forms

Now let's get back to the form and make it functional.

## Model-Driven Forms

In order to use features of Angular 2 for Forms - we need to import `FormsModule` into our `NgModule`, so let's do it:

[{]: <helper> (diff_step 5.6)
#### Step 5.6: Import Forms modules

##### Changed client/imports/app/app.module.ts
```diff
@@ -1,12 +1,15 @@
 ┊ 1┊ 1┊import { NgModule } from '@angular/core';
 ┊ 2┊ 2┊import { BrowserModule } from '@angular/platform-browser';
+┊  ┊ 3┊import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 ┊ 3┊ 4┊
 ┊ 4┊ 5┊import { AppComponent } from './app.component';
 ┊ 5┊ 6┊import { PARTIES_DECLARATIONS } from './parties';
 ┊ 6┊ 7┊
 ┊ 7┊ 8┊@NgModule({
 ┊ 8┊ 9┊  imports: [
-┊ 9┊  ┊    BrowserModule
+┊  ┊10┊    BrowserModule,
+┊  ┊11┊    FormsModule,
+┊  ┊12┊    ReactiveFormsModule
 ┊10┊13┊  ],
 ┊11┊14┊  declarations: [
 ┊12┊15┊    AppComponent,
```
[}]: #

> Full documentation of `FormsModule` and a comprehensive tutorial is located [here](https://angular.io/docs/ts/latest/guide/forms.html).

Let's construct our form model. There is a special class for this called [`FormBuilder`](https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html).

First, we should import necessary dependencies, then build the model and its future fields with help of the `FormBuilder` instance:

[{]: <helper> (diff_step 5.7)
#### Step 5.7: Create form model

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -1,4 +1,5 @@
-┊1┊ ┊import { Component } from '@angular/core';
+┊ ┊1┊import { Component, OnInit } from '@angular/core';
+┊ ┊2┊import { FormGroup, FormBuilder } from '@angular/forms';
 ┊2┊3┊
 ┊3┊4┊import template from './parties-form.component.html';
 ┊4┊5┊
```
```diff
@@ -6,4 +7,18 @@
 ┊ 6┊ 7┊  selector: 'parties-form',
 ┊ 7┊ 8┊  template
 ┊ 8┊ 9┊})
-┊ 9┊  ┊export class PartiesFormComponent {}
+┊  ┊10┊export class PartiesFormComponent implements OnInit {
+┊  ┊11┊  addForm: FormGroup;
+┊  ┊12┊
+┊  ┊13┊  constructor(
+┊  ┊14┊    private formBuilder: FormBuilder
+┊  ┊15┊  ) {}
+┊  ┊16┊
+┊  ┊17┊  ngOnInit() {
+┊  ┊18┊    this.addForm = this.formBuilder.group({
+┊  ┊19┊      name: [],
+┊  ┊20┊      description: [],
+┊  ┊21┊      location: []
+┊  ┊22┊    });
+┊  ┊23┊  }
+┊  ┊24┊}
```
[}]: #

  > As you probably noticed, we used OnInit interface. It brings the ngOnInit method.
  It initialize the directive/component after Angular initializes the data-bound input properties.
  Angular will find and call methods like ngOnInit(), with or without the interfaces.
  Nonetheless, we strongly recommend adding interfaces to TypeScript directive classes in order to benefit from strong typing and editor tooling.

`FormGroup` is a set of `FormControl`s.

Alternatively, we could write:

    this.addForm = new FormGroup({
      name: new FormControl()
    });

The first value provided is the initial value for the form control. For example:

    this.addForm = this.formBuilder.group({
      name: ['Bob']
    });

will initialize name to _Bob_ value.

We can use `addForm.value` to access current state of the model:

    console.log(this.addForm.value);
    > { name: '', description: '', location: ''}

We could also access the control values individually.

    console.log(this.addForm.controls.name.value);
    > ''

Now let's move to the template. We have to bind to `formGroup` and add `formControlName` directives to our inputs.

[{]: <helper> (diff_step 5.8)
#### Step 5.8: Implement form directives

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,12 +1,12 @@
-┊ 1┊  ┊<form>
+┊  ┊ 1┊<form [formGroup]="addForm">
 ┊ 2┊ 2┊  <label>Name</label>
-┊ 3┊  ┊  <input type="text">
+┊  ┊ 3┊  <input type="text" formControlName="name">
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊  <label>Description</label>
-┊ 6┊  ┊  <input type="text">
+┊  ┊ 6┊  <input type="text" formControlName="description">
 ┊ 7┊ 7┊
 ┊ 8┊ 8┊  <label>Location</label>
-┊ 9┊  ┊  <input type="text">
+┊  ┊ 9┊  <input type="text" formControlName="location">
 ┊10┊10┊  
-┊11┊  ┊  <button>Add</button>
+┊  ┊11┊  <button type="submit">Add</button>
 ┊12┊12┊</form>🚫↵
```
[}]: #

By `formGroup` we provide an instance of the `FormGroup`, in our case this is the `addForm`.

But what about those `formControlName` directives? As you can see, we implemented them with values that match our `addForm` structure. Each `formControlName` binds value of a form element to the model.

Now each time the user types inside these inputs, the value of the `addForm` and its controls will be automatically updated.

Conversely, if `addForm` is changed outside of the HTML, the input values will be updated accordingly.

Since `name` and `location` are required fields in our model, let's set up validation.

In Angular2, it's less then easy, just add [`Validators.required`](https://angular.io/docs/ts/latest/api/common/Validators-class.html) as a second parameter to a required control:

[{]: <helper> (diff_step 5.9)
#### Step 5.9: Add validators

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -1,5 +1,5 @@
 ┊1┊1┊import { Component, OnInit } from '@angular/core';
-┊2┊ ┊import { FormGroup, FormBuilder } from '@angular/forms';
+┊ ┊2┊import { FormGroup, FormBuilder, Validators } from '@angular/forms';
 ┊3┊3┊
 ┊4┊4┊import template from './parties-form.component.html';
 ┊5┊5┊
```
```diff
@@ -16,9 +16,9 @@
 ┊16┊16┊
 ┊17┊17┊  ngOnInit() {
 ┊18┊18┊    this.addForm = this.formBuilder.group({
-┊19┊  ┊      name: [],
+┊  ┊19┊      name: ['', Validators.required],
 ┊20┊20┊      description: [],
-┊21┊  ┊      location: []
+┊  ┊21┊      location: ['', Validators.required]
 ┊22┊22┊    });
 ┊23┊23┊  }
 ┊24┊24┊}
```
[}]: #

We can check `addForm.valid` property to determine if the form is valid:  

    console.log(this.addForm.valid)
    > false


## Event Handlers

### (ngSubmit)

We just set up the form and synchronized it with the form model.

Let's start adding new parties to the `Parties` collection.
Before we start, we create a new submit button and a form submit event handler.

It's worth mentioning one more great feature that appeared in Angular 2.
It's possible now to define and use local variables in a template.

For example, if we were using `Template-driven Forms`, to add a party we would need to take the
current state of the form and pass it to an event handler.
We could take the form and print it inside the template:

    <form #f="ngForm">
        ...
        {{f.value}}
    </form>

you'll see something like:

    {name: '', description: '', location: ''}

which is exactly what we would need — the form model object.

Since we decided to use `Model-driven Forms` we won't use it, but I think it's worth to mention because of its simplicity and power.

Back to the tutorial!

Let's bind a submit event to the add button.

This event will trigger if the button is clicked, or if the user presses enter on the final field.

[{]: <helper> (diff_step 5.10)
#### Step 5.10: Add ngSubmit to the form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊<form [formGroup]="addForm">
+┊ ┊1┊<form [formGroup]="addForm" (ngSubmit)="addParty()">
 ┊2┊2┊  <label>Name</label>
 ┊3┊3┊  <input type="text" formControlName="name">
```
[}]: #

In Angular 2, events are indicated by the round bracket () syntax. Here we are telling Angular to call a method `addParty` on submit. Let's add the addParty method to our PartiesFormComponent class.

[{]: <helper> (diff_step 5.11)
#### Step 5.11: Add addParty method

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -1,6 +1,8 @@
 ┊1┊1┊import { Component, OnInit } from '@angular/core';
 ┊2┊2┊import { FormGroup, FormBuilder, Validators } from '@angular/forms';
 ┊3┊3┊
+┊ ┊4┊import { Parties } from '../../../../both/collections/parties.collection';
+┊ ┊5┊
 ┊4┊6┊import template from './parties-form.component.html';
 ┊5┊7┊
 ┊6┊8┊@Component({
```
```diff
@@ -21,4 +23,12 @@
 ┊21┊23┊      location: ['', Validators.required]
 ┊22┊24┊    });
 ┊23┊25┊  }
+┊  ┊26┊
+┊  ┊27┊  addParty(): void {
+┊  ┊28┊    if (this.addForm.valid) {
+┊  ┊29┊      Parties.insert(this.addForm.value);
+┊  ┊30┊
+┊  ┊31┊      this.addForm.reset();
+┊  ┊32┊    }
+┊  ┊33┊  }
 ┊24┊34┊}
```
[}]: #

> Note: TypeScript doesn't know which controls properties are available so we have to put them in the squery brackets.

Open a different browser, fill out the form, submit and see how the party is added on both clients.

## Types

In order to get a better coded application, we will use the power of TypeScript and declare our types, models and interfaces of the database objects.

First, we will get warning and errors from the TypeScript compiler, and we also get great IDE support if you uses WebStorm or VSCode.

So first, let's create a base model for our database entities, which contains the `_id` field:

[{]: <helper> (diff_step 5.14)
#### Step 5.14: Create CollectionObject model

##### Added both/models/collection-object.model.ts
```diff
@@ -0,0 +1,3 @@
+┊ ┊1┊export interface CollectionObject {
+┊ ┊2┊  _id?: string;
+┊ ┊3┊}🚫↵
```
[}]: #

And let's create a model for a single `Party` object:

[{]: <helper> (diff_step 5.15)
#### Step 5.15: Extend Party by CollectionObject model

##### Changed both/models/party.model.ts
```diff
@@ -1,4 +1,6 @@
-┊1┊ ┊export interface Party {
+┊ ┊1┊import { CollectionObject } from './collection-object.model';
+┊ ┊2┊
+┊ ┊3┊export interface Party extends CollectionObject {
 ┊2┊4┊  name: string;
 ┊3┊5┊  description: string;
 ┊4┊6┊  location: string;
```
[}]: #

We will later use those to indicate the types of our collection and objects in the UI.

### (click)

Now, let's add the ability to delete parties.

Let's add an X button to each party in our party list:

[{]: <helper> (diff_step 5.12)
#### Step 5.12: Add remove button

##### Changed client/imports/app/app.component.html
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊      {{party.name}}
 ┊ 7┊ 7┊      <p>{{party.description}}</p>
 ┊ 8┊ 8┊      <p>{{party.location}}</p>
+┊  ┊ 9┊      <button (click)="removeParty(party)">X</button>
 ┊ 9┊10┊    </li>
 ┊10┊11┊  </ul>
 ┊11┊12┊</div>🚫↵
```
[}]: #

Here again, we are binding an event to the class context and passing in the party as a parameter.

Let's go into the class and add that method.

Add the method inside the AppComponent class in `app.component.ts`:

[{]: <helper> (diff_step 5.13)
#### Step 5.13: Implement removeParty method

##### Changed client/imports/app/app.component.ts
```diff
@@ -16,4 +16,8 @@
 ┊16┊16┊  constructor() {
 ┊17┊17┊    this.parties = Parties.find({}).zone();
 ┊18┊18┊  }
+┊  ┊19┊
+┊  ┊20┊  removeParty(party: Party): void {
+┊  ┊21┊    Parties.remove(party._id);
+┊  ┊22┊  }
 ┊19┊23┊}
```
[}]: #

The Mongo Collection Parties has a method called "remove". We search for the relevant party by its identifier, `_id`, and delete it.

Now try to delete a few parties. Since Meteor syncs data between clients, you can also watch them being removed from other browser clients.

# Summary

In this chapter we've seen:

- How easy it is to create a form and access its data using Angular 2's power.
- How easy it is to save that data to the storage using Meteor's power.
- How to declare TypeScript interfaces and models.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #