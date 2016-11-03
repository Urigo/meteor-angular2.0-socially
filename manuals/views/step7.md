[{]: <region> (header)
# Step 7: Bind one object
[}]: #
[{]: <region> (body)
In this step we are going to:

- add a form to the party details view
- bind a party object to the view, so that we'll be able to change party details and
then save changes to the storage

# Two-Way Data Binding

As we've already explored on the 3rd step, data can be bound to the HTML input elements
with the help of a group of special Angular 2 Control objects, otherwise called a form model.
We called this approach the _Model-Driven approach_.

Also, it was mentioned that Angular 2 has support of two-way data binding
through a special attribute, though with different syntax from Angular 1. We'll get to this shortly.

First, let's bind the party details into our view:

[{]: <helper> (diff_step 7.1)
#### Step 7.1: Display party details

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,5 +1,7 @@
-┊1┊ ┊<header>
-┊2┊ ┊  <h2>PARTY_NAME</h2>
+┊ ┊1┊<header *ngIf="party">
+┊ ┊2┊  <h2>{{party.name}}</h2>
 ┊3┊3┊
-┊4┊ ┊  <p>PARTY_DESCRIPTION</p>
+┊ ┊4┊  <p>{{party.description}}</p>
+┊ ┊5┊
+┊ ┊6┊  <p>{{party.location}}</p>
 ┊5┊7┊</header>🚫↵
```
[}]: #

Now, let's change `party-details.component.html` into a form, so that we can edit the party details:

[{]: <helper> (diff_step 7.2)
#### Step 7.2: Create form inside PartyDetails template

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,7 +1,13 @@
-┊ 1┊  ┊<header *ngIf="party">
-┊ 2┊  ┊  <h2>{{party.name}}</h2>
+┊  ┊ 1┊<form *ngIf="party" (submit)="saveParty()">
+┊  ┊ 2┊  <label>Name</label>
+┊  ┊ 3┊  <input type="text" [(ngModel)]="party.name" name="name">
 ┊ 3┊ 4┊
-┊ 4┊  ┊  <p>{{party.description}}</p>
+┊  ┊ 5┊  <label>Description</label>
+┊  ┊ 6┊  <input type="text" [(ngModel)]="party.description" name="description">
 ┊ 5┊ 7┊
-┊ 6┊  ┊  <p>{{party.location}}</p>
-┊ 7┊  ┊</header>🚫↵
+┊  ┊ 8┊  <label>Location</label>
+┊  ┊ 9┊  <input type="text" [(ngModel)]="party.location" name="location">
+┊  ┊10┊
+┊  ┊11┊  <button type="submit">Save</button>
+┊  ┊12┊  <a [routerLink]="['/']">Cancel</a>
+┊  ┊13┊</form>🚫↵
```
[}]: #

> Notice we have a routerLink button on the page that redirects back to the list (from our previous step's challenge). Here is how to do that:

> We added an `ngIf` directive to conditionally display the form when the party data is available.

## ngModel

[ngModel](https://angular.io/docs/js/latest/api/common/NgModel-directive.html) binds a HTML form to the component's model, which can be an object of any type, in comparison to
the Model-Driven binding where the `FormGroup` instance is used.

The syntax looks a bit different, using both square and rounded brackets: `[(ngModel)]`. `ngModel` binds to the party properties and fills out the inputs, and vice versa.

Let's do a little test to see how form controls and events work in Angular 2. Start by binding to `party.name` below the input, then experiment by changing the input's text.

    <label for="name">Name</label>
    <input type="text" [(ngModel)]="party.name" name="name">

    <p>{{party.name}}</p>

Notice that it updates automatically on changes. You can contrast this to `FormControl`s which we need to update manually using events to reach this functionality.

As a finishing touch, let's add a submit event handler that saves the current party:

[{]: <helper> (diff_step 7.3)
#### Step 7.3: Add submit event handler

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -32,6 +32,16 @@
 ┊32┊32┊      });
 ┊33┊33┊  }
 ┊34┊34┊
+┊  ┊35┊  saveParty() {
+┊  ┊36┊    Parties.update(this.party._id, {
+┊  ┊37┊      $set: {
+┊  ┊38┊        name: this.party.name,
+┊  ┊39┊        description: this.party.description,
+┊  ┊40┊        location: this.party.location
+┊  ┊41┊      }
+┊  ┊42┊    });
+┊  ┊43┊  }
+┊  ┊44┊
 ┊35┊45┊  ngOnDestroy() {
 ┊36┊46┊    this.paramsSub.unsubscribe();
 ┊37┊47┊  }
```
[}]: #

# Summary

In this step, we learned:

- how two-way data binding works in Angular 2 using `[(ngModel)]`
- how to bind inputs to the view and save the data

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step6.md) | [Next Step >](step8.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #