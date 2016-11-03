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

{{{diff_step 5.1}}}

Notice that we are exporting the class `PartiesFormComponent` using ES6 module syntax.
As a result, you'll be able to import `PartiesFormComponent` in any other component as follows:

    import { PartiesFormComponent } from 'client/imports/app/parties/parties-form.component';

By exporting and importing different modules, you create a modular structure of your app in ES6,
which is similar to the modules in other script languages like Python.
This is what makes programming in ES6 really awesome since application structure comes out rigid and clear.

Let's add a template for the new component.

Add a file with the following form:

{{{diff_step 5.2}}}

We can load the new `PartiesForm` component on the page by placing the `<parties-form>` tag in the root template `app.html`:

{{{diff_step 5.3}}}

There is one more required step in Angular 2 to load a component - we need to declare it in the our `NgModule` so other Components know it existing and can use it.

We will create a new file that `export`s an Array of `Component`s that needed to be declared in the `NgModule`:

{{{diff_step 5.4}}}

And now let's load this Array of `Component`s into our `NgModule`:

{{{diff_step 5.5}}}

> The `...` is part of ES2016 language - it spreads the array like it was not an array, you can read more about it [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator).

Now we have our parties-form directive showing on our app.

# Angular 2 Forms

Now let's get back to the form and make it functional.

## Model-Driven Forms

In order to use features of Angular 2 for Forms - we need to import `FormsModule` into our `NgModule`, so let's do it:

{{{diff_step 5.6}}}

> Full documentation of `FormsModule` and a comprehensive tutorial is located [here](https://angular.io/docs/ts/latest/guide/forms.html).

Let's construct our form model. There is a special class for this called [`FormBuilder`](https://angular.io/docs/ts/latest/api/common/FormBuilder-class.html).

First, we should import necessary dependencies, then build the model and its future fields with help of the `FormBuilder` instance:

{{{diff_step 5.7}}}

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

{{{diff_step 5.8}}}

By `formGroup` we provide an instance of the `FormGroup`, in our case this is the `addForm`.

But what about those `formControlName` directives? As you can see, we implemented them with values that match our `addForm` structure. Each `formControlName` binds value of a form element to the model.

Now each time the user types inside these inputs, the value of the `addForm` and its controls will be automatically updated.

Conversely, if `addForm` is changed outside of the HTML, the input values will be updated accordingly.

Since `name` and `location` are required fields in our model, let's set up validation.

In Angular2, it's less then easy, just add [`Validators.required`](https://angular.io/docs/ts/latest/api/common/Validators-class.html) as a second parameter to a required control:

{{{diff_step 5.9}}}

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
        \{{f.value}}
    </form>

you'll see something like:

    {name: '', description: '', location: ''}

which is exactly what we would need — the form model object.

Since we decided to use `Model-driven Forms` we won't use it, but I think it's worth to mention because of its simplicity and power.

Back to the tutorial!

Let's bind a submit event to the add button.

This event will trigger if the button is clicked, or if the user presses enter on the final field.

{{{diff_step 5.10}}}

In Angular 2, events are indicated by the round bracket () syntax. Here we are telling Angular to call a method `addParty` on submit. Let's add the addParty method to our PartiesFormComponent class.

{{{diff_step 5.11}}}

> Note: TypeScript doesn't know which controls properties are available so we have to put them in the squery brackets.

Open a different browser, fill out the form, submit and see how the party is added on both clients.

## Types

In order to get a better coded application, we will use the power of TypeScript and declare our types, models and interfaces of the database objects.

First, we will get warning and errors from the TypeScript compiler, and we also get great IDE support if you uses WebStorm or VSCode.

So first, let's create a base model for our database entities, which contains the `_id` field:

{{{diff_step 5.14}}}

And let's create a model for a single `Party` object:

{{{diff_step 5.15}}}

We will later use those to indicate the types of our collection and objects in the UI.

### (click)

Now, let's add the ability to delete parties.

Let's add an X button to each party in our party list:

{{{diff_step 5.12}}}

Here again, we are binding an event to the class context and passing in the party as a parameter.

Let's go into the class and add that method.

Add the method inside the AppComponent class in `app.component.ts`:

{{{diff_step 5.13}}}

The Mongo Collection Parties has a method called "remove". We search for the relevant party by its identifier, `_id`, and delete it.

Now try to delete a few parties. Since Meteor syncs data between clients, you can also watch them being removed from other browser clients.

# Summary

In this chapter we've seen:

- How easy it is to create a form and access its data using Angular 2's power.
- How easy it is to save that data to the storage using Meteor's power.
- How to declare TypeScript interfaces and models.
