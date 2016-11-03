[{]: <region> (header)
# Step 18: CSS, SASS and Bootstrap
[}]: #
[{]: <region> (body)
In this chapter we will add Twitter's bootstrap to our project, and add some style and layout to the project.

# Adding and importing Bootstrap 4

First, we need to add Bootstrap 4 to our project - so let's do that.

Run the following command in your Terminal:

    $ meteor npm install --save bootstrap@4.0.0-alpha.3

 Import Bootstrap's styles into your project:

[{]: <helper> (diff_step 18.2)
#### Step 18.2: Import bootstrap style into the main style file

##### Changed client/main.scss
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊@import "{}/node_modules/bootstrap/scss/bootstrap.scss";
+┊ ┊2┊
 ┊1┊3┊.sebm-google-map-container {
 ┊2┊4┊  width: 400px;
 ┊3┊5┊  height: 400px;
```
[}]: #

# First touch of style

Now let's add some style! we will add navigation bar in the top of the page.

We will also add a container with the `router-outlet` to keep that content of the page:

[{]: <helper> (diff_step 18.3)
#### Step 18.3: Add bootstrap navbar

##### Changed client/imports/app/app.component.html
```diff
@@ -1,3 +1,6 @@
-┊1┊ ┊<div>
+┊ ┊1┊<nav class="navbar navbar-light bg-faded">
+┊ ┊2┊  <a class="navbar-brand" href="#">Socially</a>
+┊ ┊3┊</nav>
+┊ ┊4┊<div class="container-fluid">
 ┊2┊5┊  <router-outlet></router-outlet>
 ┊3┊6┊</div>🚫↵
```
[}]: #

# Moving things around

So first thing we want to do now, is to move the login buttons to another place - let's say that we want it as a part of the navigation bar.

So first let's remove it from it's current place (parties list), first the view:

[{]: <helper> (diff_step 18.4)
#### Step 18.4: Remove LoginButtons from a template

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -2,8 +2,6 @@
 ┊2┊2┊  <parties-form [hidden]="!user" style="float: left"></parties-form>
 ┊3┊3┊  <input type="text" #searchtext placeholder="Search by Location">
 ┊4┊4┊  <button type="button" (click)="search(searchtext.value)">Search</button>
-┊5┊ ┊  
-┊6┊ ┊  <login-buttons></login-buttons>
 ┊7┊5┊
 ┊8┊6┊  <h1>Parties:</h1>
```
[}]: #

And add it to the main component, which is the component that responsible to the navigation bar, so the view first:

[{]: <helper> (diff_step 18.5)
#### Step 18.5: Add login buttons to the navigation bar

##### Changed client/imports/app/app.component.html
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊<nav class="navbar navbar-light bg-faded">
 ┊2┊2┊  <a class="navbar-brand" href="#">Socially</a>
+┊ ┊3┊  <login-buttons class="pull-right"></login-buttons>
 ┊3┊4┊</nav>
 ┊4┊5┊<div class="container-fluid">
 ┊5┊6┊  <router-outlet></router-outlet>
```
[}]: #

# Fonts and FontAwesome

Meteor gives you the control of your `head` tag, so you can import fonts and add your `meta` tags.

We will add a cool font and add [FontAwesome](https://fortawesome.github.io/Font-Awesome/) style file, which also contains it's font:

[{]: <helper> (diff_step 18.6)
#### Step 18.6: Add fonts and FontAwesome

##### Changed client/index.html
```diff
@@ -1,5 +1,8 @@
 ┊1┊1┊<head>
+┊ ┊2┊  <meta name="viewport" content="width=device-width, initial-scale=1">
 ┊2┊3┊  <base href="/">
+┊ ┊4┊  <link href='http://fonts.googleapis.com/css?family=Muli:400,300' rel='stylesheet' type='text/css'>
+┊ ┊5┊  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
 ┊3┊6┊</head>
 ┊4┊7┊<body>
 ┊5┊8┊  <app>Loading...</app>
```
[}]: #

# Some more style

So now we will take advantage of all Bootstrap's features - first let's update the layout of the form:

[{]: <helper> (diff_step 18.7)
#### Step 18.7: Update the new party form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -1,15 +1,21 @@
-┊ 1┊  ┊<form [formGroup]="addForm" (ngSubmit)="addParty()">
-┊ 2┊  ┊  <label>Name</label>
-┊ 3┊  ┊  <input type="text" formControlName="name">
+┊  ┊ 1┊<form [formGroup]="addForm" (ngSubmit)="addParty()" class="form-inline">
+┊  ┊ 2┊  <fieldset class="form-group">
+┊  ┊ 3┊    <label for="partyName">Party name</label>
+┊  ┊ 4┊    <input id="partyName" class="form-control" type="text" formControlName="name" placeholder="Party name" />
 ┊ 4┊ 5┊
-┊ 5┊  ┊  <label>Description</label>
-┊ 6┊  ┊  <input type="text" formControlName="description">
+┊  ┊ 6┊    <label for="description">Description</label>
+┊  ┊ 7┊    <input id="description" class="form-control" type="text" formControlName="description" placeholder="Description">
 ┊ 7┊ 8┊
-┊ 8┊  ┊  <label>Location</label>
-┊ 9┊  ┊  <input type="text" formControlName="location">
+┊  ┊ 9┊    <label for="location_name">Location</label>
+┊  ┊10┊    <input id="location_name" class="form-control" type="text" formControlName="location" placeholder="Location name">
 ┊10┊11┊
-┊11┊  ┊  <label>Public</label>
-┊12┊  ┊  <input type="checkbox" formControlName="public">
-┊13┊  ┊  
-┊14┊  ┊  <button type="submit">Add</button>
-┊15┊  ┊</form>🚫↵
+┊  ┊12┊    <div class="checkbox">
+┊  ┊13┊      <label>
+┊  ┊14┊        <input type="checkbox" formControlName="public">
+┊  ┊15┊        Public
+┊  ┊16┊      </label>
+┊  ┊17┊    </div>
+┊  ┊18┊
+┊  ┊19┊    <button type="submit" class="btn btn-primary">Add</button>
+┊  ┊20┊  </fieldset>
+┊  ┊21┊</form>
```
[}]: #

And now the parties list:

[{]: <helper> (diff_step 18.8)
#### Step 18.8: Update parties list layout

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -1,44 +1,100 @@
-┊  1┊   ┊<div>
-┊  2┊   ┊  <parties-form [hidden]="!user" style="float: left"></parties-form>
-┊  3┊   ┊  <input type="text" #searchtext placeholder="Search by Location">
-┊  4┊   ┊  <button type="button" (click)="search(searchtext.value)">Search</button>
-┊  5┊   ┊
-┊  6┊   ┊  <h1>Parties:</h1>
-┊  7┊   ┊
-┊  8┊   ┊  <div>
-┊  9┊   ┊    <select #sort (change)="changeSortOrder(sort.value)">
+┊   ┊  1┊<div class="row">
+┊   ┊  2┊  <div class="col-md-12">
+┊   ┊  3┊    <div class="jumbotron">
+┊   ┊  4┊      <h3>Create a new party!</h3>
+┊   ┊  5┊      <parties-form [hidden]="!user"></parties-form>
+┊   ┊  6┊      <div [hidden]="user">You need to login to create new parties!</div>
+┊   ┊  7┊    </div>
+┊   ┊  8┊  </div>
+┊   ┊  9┊</div>
+┊   ┊ 10┊<div class="row ma-filters">
+┊   ┊ 11┊  <div class="col-md-6">
+┊   ┊ 12┊    <h3>All Parties:</h3>
+┊   ┊ 13┊    <form class="form-inline">
+┊   ┊ 14┊      <input type="text" class="form-control" #searchtext placeholder="Search by Location">
+┊   ┊ 15┊      <button type="button" class="btn btn-primary" (click)="search(searchtext.value)">Search</button>
+┊   ┊ 16┊      Sort by name: <select class="form-control" #sort (change)="changeSortOrder(sort.value)">
 ┊ 10┊ 17┊      <option value="1" selected>Ascending</option>
 ┊ 11┊ 18┊      <option value="-1">Descending</option>
 ┊ 12┊ 19┊    </select>
+┊   ┊ 20┊    </form>
+┊   ┊ 21┊  </div>
+┊   ┊ 22┊</div>
+┊   ┊ 23┊<div class="row">
+┊   ┊ 24┊  <div class="col-md-6">
+┊   ┊ 25┊    <ul class="list-group">
+┊   ┊ 26┊      <li class="list-group-item">
+┊   ┊ 27┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
+┊   ┊ 28┊      </li>
+┊   ┊ 29┊      <li *ngFor="let party of parties | async"
+┊   ┊ 30┊          class="list-group-item ma-party-item">
+┊   ┊ 31┊        <div class="row">
+┊   ┊ 32┊          <div class="col-sm-8">
+┊   ┊ 33┊            <h2 class="ma-party-name">
+┊   ┊ 34┊              <a [routerLink]="['/party', party._id]">{{party.name}}</a>
+┊   ┊ 35┊            </h2>
+┊   ┊ 36┊            @ {{party.location.name}}
+┊   ┊ 37┊            <p class="ma-party-description">
+┊   ┊ 38┊              {{party.description}}
+┊   ┊ 39┊            </p>
+┊   ┊ 40┊          </div>
+┊   ┊ 41┊          <div class="col-sm-4">
+┊   ┊ 42┊            <button class="btn btn-danger pull-right" [hidden]="!isOwner(party)" (click)="removeParty(party)"><i
+┊   ┊ 43┊              class="fa fa-times"></i></button>
+┊   ┊ 44┊          </div>
+┊   ┊ 45┊        </div>
+┊   ┊ 46┊        <div class="row ma-party-item-bottom">
+┊   ┊ 47┊          <div class="col-sm-4">
+┊   ┊ 48┊            <div class="ma-rsvp-sum">
+┊   ┊ 49┊              <div class="ma-rsvp-amount">
+┊   ┊ 50┊                <div class="ma-amount">
+┊   ┊ 51┊                  {{party | rsvp:'yes'}}
+┊   ┊ 52┊                </div>
+┊   ┊ 53┊                <div class="ma-rsvp-title">
+┊   ┊ 54┊                  YES
+┊   ┊ 55┊                </div>
+┊   ┊ 56┊              </div>
+┊   ┊ 57┊              <div class="ma-rsvp-amount">
+┊   ┊ 58┊                <div class="ma-amount">
+┊   ┊ 59┊                  {{party | rsvp:'maybe'}}
+┊   ┊ 60┊                </div>
+┊   ┊ 61┊                <div class="ma-rsvp-title">
+┊   ┊ 62┊                  MAYBE
+┊   ┊ 63┊                </div>
+┊   ┊ 64┊              </div>
+┊   ┊ 65┊              <div class="ma-rsvp-amount">
+┊   ┊ 66┊                <div class="ma-amount">
+┊   ┊ 67┊                  {{party | rsvp:'no'}}
+┊   ┊ 68┊                </div>
+┊   ┊ 69┊                <div class="ma-rsvp-title">
+┊   ┊ 70┊                  NO
+┊   ┊ 71┊                </div>
+┊   ┊ 72┊              </div>
+┊   ┊ 73┊            </div>
+┊   ┊ 74┊          </div>
+┊   ┊ 75┊        </div>
+┊   ┊ 76┊      </li>
+┊   ┊ 77┊      <li class="list-group-item">
+┊   ┊ 78┊        <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
+┊   ┊ 79┊      </li>
+┊   ┊ 80┊    </ul>
+┊   ┊ 81┊  </div>
+┊   ┊ 82┊  <div class="col-md-6">
+┊   ┊ 83┊    <ul class="list-group">
+┊   ┊ 84┊      <li class="list-group-item">
+┊   ┊ 85┊        <sebm-google-map
+┊   ┊ 86┊          [latitude]="0"
+┊   ┊ 87┊          [longitude]="0"
+┊   ┊ 88┊          [zoom]="1">
+┊   ┊ 89┊          <div *ngFor="let party of parties | async">
+┊   ┊ 90┊            <sebm-google-map-marker
+┊   ┊ 91┊              *ngIf="party.location.lat"
+┊   ┊ 92┊              [latitude]="party.location.lat"
+┊   ┊ 93┊              [longitude]="party.location.lng">
+┊   ┊ 94┊            </sebm-google-map-marker>
+┊   ┊ 95┊          </div>
+┊   ┊ 96┊        </sebm-google-map>
+┊   ┊ 97┊      </li>
+┊   ┊ 98┊    </ul>
 ┊ 13┊ 99┊  </div>
-┊ 14┊   ┊
-┊ 15┊   ┊  <ul>
-┊ 16┊   ┊    <li *ngFor="let party of parties | async">
-┊ 17┊   ┊      <a [routerLink]="['/party', party._id]">{{party.name}}</a>
-┊ 18┊   ┊      <p>{{party.description}}</p>
-┊ 19┊   ┊      <p>{{party.location.name}}</p>
-┊ 20┊   ┊      <button [hidden]="!isOwner(party)" (click)="removeParty(party)">X</button>
-┊ 21┊   ┊      <div>
-┊ 22┊   ┊        Who is coming:
-┊ 23┊   ┊        Yes - {{party | rsvp:'yes'}}
-┊ 24┊   ┊        Maybe - {{party | rsvp:'maybe'}}
-┊ 25┊   ┊        No - {{party | rsvp:'no'}}
-┊ 26┊   ┊      </div>
-┊ 27┊   ┊    </li>
-┊ 28┊   ┊  </ul>
-┊ 29┊   ┊
-┊ 30┊   ┊  <sebm-google-map
-┊ 31┊   ┊    [latitude]="0"
-┊ 32┊   ┊    [longitude]="0"
-┊ 33┊   ┊    [zoom]="1">
-┊ 34┊   ┊    <div *ngFor="let party of parties | async">
-┊ 35┊   ┊      <sebm-google-map-marker
-┊ 36┊   ┊        *ngIf="party.location.lat"
-┊ 37┊   ┊        [latitude]="party.location.lat"
-┊ 38┊   ┊        [longitude]="party.location.lng">
-┊ 39┊   ┊      </sebm-google-map-marker>
-┊ 40┊   ┊    </div>
-┊ 41┊   ┊  </sebm-google-map>
-┊ 42┊   ┊
-┊ 43┊   ┊  <pagination-controls (pageChange)="onPageChanged($event)"></pagination-controls>
 ┊ 44┊100┊</div>🚫↵
```
[}]: #

# Styling components

We will create style file for each component.

So let's start with the parties list, and add some style (it's not that critical at the moment what is the effect of those CSS rules)

[{]: <helper> (diff_step 18.9)
#### Step 18.9: Add styles for PartiesList

##### Added client/imports/app/parties/parties-list.component.scss
```diff
@@ -0,0 +1,127 @@
+┊   ┊  1┊@import "../colors";
+┊   ┊  2┊
+┊   ┊  3┊.ma-add-button-container {
+┊   ┊  4┊  button.btn {
+┊   ┊  5┊    background: $color3;
+┊   ┊  6┊    float: right;
+┊   ┊  7┊    margin-right: 5px;
+┊   ┊  8┊    outline: none;
+┊   ┊  9┊    i {
+┊   ┊ 10┊      color: $color5;
+┊   ┊ 11┊    }
+┊   ┊ 12┊  }
+┊   ┊ 13┊}
+┊   ┊ 14┊
+┊   ┊ 15┊.ma-parties-col {
+┊   ┊ 16┊  padding-top: 20px;
+┊   ┊ 17┊}
+┊   ┊ 18┊
+┊   ┊ 19┊.ma-filters {
+┊   ┊ 20┊  margin-bottom: 10px;
+┊   ┊ 21┊}
+┊   ┊ 22┊
+┊   ┊ 23┊.ma-party-item {
+┊   ┊ 24┊  .ma-party-name {
+┊   ┊ 25┊    margin-bottom: 20px;
+┊   ┊ 26┊    a {
+┊   ┊ 27┊      color: $color6;
+┊   ┊ 28┊      text-decoration: none !important;
+┊   ┊ 29┊      font-weight: 400;
+┊   ┊ 30┊    }
+┊   ┊ 31┊  }
+┊   ┊ 32┊  .ma-party-description {
+┊   ┊ 33┊    color: $color6;
+┊   ┊ 34┊    font-weight: 300;
+┊   ┊ 35┊    padding-left: 18px;
+┊   ┊ 36┊    font-size: 14px;
+┊   ┊ 37┊  }
+┊   ┊ 38┊
+┊   ┊ 39┊  .ma-remove {
+┊   ┊ 40┊    color: lighten($color7, 20%);
+┊   ┊ 41┊    position: absolute;
+┊   ┊ 42┊    right: 20px;
+┊   ┊ 43┊    top: 20px;
+┊   ┊ 44┊    &:hover {
+┊   ┊ 45┊      color: $color7;
+┊   ┊ 46┊    }
+┊   ┊ 47┊  }
+┊   ┊ 48┊
+┊   ┊ 49┊  .ma-party-item-bottom {
+┊   ┊ 50┊    padding-top: 10px;
+┊   ┊ 51┊    .ma-posted-by-col {
+┊   ┊ 52┊      .ma-posted-by {
+┊   ┊ 53┊        color: darken($color4, 30%);
+┊   ┊ 54┊        font-size: 12px;
+┊   ┊ 55┊      }
+┊   ┊ 56┊      .ma-everyone-invited {
+┊   ┊ 57┊        @media (max-width: 400px) {
+┊   ┊ 58┊          display: block;
+┊   ┊ 59┊          i {
+┊   ┊ 60┊            margin-left: 0px !important;
+┊   ┊ 61┊          }
+┊   ┊ 62┊        }
+┊   ┊ 63┊        font-size: 12px;
+┊   ┊ 64┊        color: darken($color4, 10%);
+┊   ┊ 65┊        i {
+┊   ┊ 66┊          color: darken($color4, 10%);
+┊   ┊ 67┊          margin-left: 5px;
+┊   ┊ 68┊        }
+┊   ┊ 69┊      }
+┊   ┊ 70┊    }
+┊   ┊ 71┊
+┊   ┊ 72┊    .ma-rsvp-buttons {
+┊   ┊ 73┊      input.btn {
+┊   ┊ 74┊        color: darken($color3, 20%);
+┊   ┊ 75┊        background: transparent !important;
+┊   ┊ 76┊        outline: none;
+┊   ┊ 77┊        padding-left: 0;
+┊   ┊ 78┊        &:active {
+┊   ┊ 79┊          box-shadow: none;
+┊   ┊ 80┊        }
+┊   ┊ 81┊        &:hover {
+┊   ┊ 82┊          color: darken($color3, 30%);
+┊   ┊ 83┊        }
+┊   ┊ 84┊        &.btn-primary {
+┊   ┊ 85┊          color: lighten($color3, 10%);
+┊   ┊ 86┊          border: 0;
+┊   ┊ 87┊          background: transparent !important;
+┊   ┊ 88┊        }
+┊   ┊ 89┊      }
+┊   ┊ 90┊    }
+┊   ┊ 91┊
+┊   ┊ 92┊    .ma-rsvp-sum {
+┊   ┊ 93┊      width: 160px;
+┊   ┊ 94┊      @media (min-width: 400px) {
+┊   ┊ 95┊        float: right;
+┊   ┊ 96┊      }
+┊   ┊ 97┊      @media (max-width: 400px) {
+┊   ┊ 98┊        margin: 0 auto;
+┊   ┊ 99┊      }
+┊   ┊100┊    }
+┊   ┊101┊    .ma-rsvp-amount {
+┊   ┊102┊      display: inline-block;
+┊   ┊103┊      text-align: center;
+┊   ┊104┊      width: 50px;
+┊   ┊105┊      .ma-amount {
+┊   ┊106┊        font-weight: bold;
+┊   ┊107┊        font-size: 20px;
+┊   ┊108┊      }
+┊   ┊109┊      .ma-rsvp-title {
+┊   ┊110┊        font-size: 11px;
+┊   ┊111┊        color: #aaa;
+┊   ┊112┊        text-transform: uppercase;
+┊   ┊113┊      }
+┊   ┊114┊    }
+┊   ┊115┊  }
+┊   ┊116┊}
+┊   ┊117┊
+┊   ┊118┊.ma-angular-map-col {
+┊   ┊119┊  .angular-google-map-container, .angular-google-map {
+┊   ┊120┊    height: 100%;
+┊   ┊121┊    width: 100%;
+┊   ┊122┊  }
+┊   ┊123┊}
+┊   ┊124┊
+┊   ┊125┊.search-form {
+┊   ┊126┊  margin-bottom: 1em;
+┊   ┊127┊}🚫↵
```
[}]: #

> Note that we used the "colors.scss" import - don't worry - we will add it soon!

And now let's add SASS file for the party details:

[{]: <helper> (diff_step 18.10)
#### Step 18.10: Add styles for the party details page

##### Added client/imports/app/parties/party-details.component.scss
```diff
@@ -0,0 +1,32 @@
+┊  ┊ 1┊.ma-party-details-container {
+┊  ┊ 2┊  padding: 20px;
+┊  ┊ 3┊
+┊  ┊ 4┊  .angular-google-map-container {
+┊  ┊ 5┊    width: 100%;
+┊  ┊ 6┊    height: 100%;
+┊  ┊ 7┊  }
+┊  ┊ 8┊
+┊  ┊ 9┊  .angular-google-map {
+┊  ┊10┊    width: 100%;
+┊  ┊11┊    height: 400px;
+┊  ┊12┊  }
+┊  ┊13┊
+┊  ┊14┊  .ma-map-title {
+┊  ┊15┊    font-size: 16px;
+┊  ┊16┊    font-weight: bolder;
+┊  ┊17┊  }
+┊  ┊18┊
+┊  ┊19┊  .ma-invite-list {
+┊  ┊20┊    margin-top: 20px;
+┊  ┊21┊    margin-bottom: 20px;
+┊  ┊22┊
+┊  ┊23┊    h3 {
+┊  ┊24┊      font-size: 16px;
+┊  ┊25┊      font-weight: bolder;
+┊  ┊26┊    }
+┊  ┊27┊
+┊  ┊28┊    ul {
+┊  ┊29┊      padding: 0;
+┊  ┊30┊    }
+┊  ┊31┊  }
+┊  ┊32┊}🚫↵
```
[}]: #

Now let's add some styles and colors using SASS to the main file and create the colors definitions file we mentioned earlier:

[{]: <helper> (diff_step 18.11)
#### Step 18.11: Add components styles in main style entry point

##### Added client/imports/app/colors.scss
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊$color1 : #2F2933;
+┊ ┊2┊$color2 : #01A2A6;
+┊ ┊3┊$color3 : #29D9C2;
+┊ ┊4┊$color4 : #BDF271;
+┊ ┊5┊$color5 : #FFFFA6;
+┊ ┊6┊$color6 : #2F2933;
+┊ ┊7┊$color7 : #FF6F69;🚫↵
```

##### Changed client/main.scss
```diff
@@ -1,6 +1,33 @@
-┊ 1┊  ┊@import "{}/node_modules/bootstrap/scss/bootstrap.scss";
+┊  ┊ 1┊@import "../node_modules/bootstrap/scss/bootstrap.scss";
+┊  ┊ 2┊@import "./imports/app/colors.scss";
+┊  ┊ 3┊
+┊  ┊ 4┊html, body {
+┊  ┊ 5┊  height: 100%;
+┊  ┊ 6┊}
+┊  ┊ 7┊
+┊  ┊ 8┊body {
+┊  ┊ 9┊  background-color: #f8f8f8;
+┊  ┊10┊  font-family: 'Muli', sans-serif;
+┊  ┊11┊}
 ┊ 2┊12┊
 ┊ 3┊13┊.sebm-google-map-container {
-┊ 4┊  ┊  width: 400px;
-┊ 5┊  ┊  height: 400px;
+┊  ┊14┊  width: 450px;
+┊  ┊15┊  height: 450px;
+┊  ┊16┊}
+┊  ┊17┊
+┊  ┊18┊.navbar {
+┊  ┊19┊  background-color: #ffffff;
+┊  ┊20┊  border-bottom: #eee 1px solid;
+┊  ┊21┊  color: $color3;
+┊  ┊22┊  font-family: 'Muli', sans-serif;
+┊  ┊23┊  a {
+┊  ┊24┊    color: $color3;
+┊  ┊25┊    text-decoration: none !important;
+┊  ┊26┊  }
+┊  ┊27┊
+┊  ┊28┊  .navbar-right-container {
+┊  ┊29┊    position: absolute;
+┊  ┊30┊    top: 17px;
+┊  ┊31┊    right: 17px;
+┊  ┊32┊  }
 ┊ 6┊33┊}🚫↵
```
[}]: #

> We defined our colors in this file, and we used it all across the our application - so it's easy to change and modify the whole theme!

Now let's use Angular 2 Component styles, which bundles the styles into the Component, without effecting other Component's styles (you can red more about it [here](https://angular.io/docs/ts/latest/guide/component-styles.html))

So let's add it to the parties list:

[{]: <helper> (diff_step 18.12)
#### Step 18.12: Import parties list style

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊import { Party } from '../../../../both/models/party.model';
 ┊14┊14┊
 ┊15┊15┊import template from './parties-list.component.html';
+┊  ┊16┊import style from './parties-list.component.scss';
 ┊16┊17┊
 ┊17┊18┊interface Pagination {
 ┊18┊19┊  limit: number;
```
```diff
@@ -25,7 +26,8 @@
 ┊25┊26┊
 ┊26┊27┊@Component({
 ┊27┊28┊  selector: 'parties-list',
-┊28┊  ┊  template
+┊  ┊29┊  template,
+┊  ┊30┊  styles: [ style ]
 ┊29┊31┊})
 ┊30┊32┊@InjectUser('user')
 ┊31┊33┊export class PartiesListComponent implements OnInit, OnDestroy {
```
[}]: #

And to the party details:

[{]: <helper> (diff_step 18.13)
#### Step 18.13: Import party details style

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -15,10 +15,12 @@
 ┊15┊15┊import { User } from '../../../../both/models/user.model';
 ┊16┊16┊
 ┊17┊17┊import template from './party-details.component.html';
+┊  ┊18┊import style from './party-details.component.scss';
 ┊18┊19┊
 ┊19┊20┊@Component({
 ┊20┊21┊  selector: 'party-details',
-┊21┊  ┊  template
+┊  ┊22┊  template,
+┊  ┊23┊  styles: [ style ]
 ┊22┊24┊})
 ┊23┊25┊@InjectUser('user')
 ┊24┊26┊export class PartyDetailsComponent implements OnInit, OnDestroy {
```
[}]: #

And use those new cool styles in the view of the party details:

[{]: <helper> (diff_step 18.14)
#### Step 18.14: Update the layout of the party details page

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -1,42 +1,61 @@
-┊ 1┊  ┊<form *ngIf="party" (submit)="saveParty()">
-┊ 2┊  ┊  <label>Name</label>
-┊ 3┊  ┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.name" name="name">
+┊  ┊ 1┊<div class="row ma-party-details-container">
+┊  ┊ 2┊  <div class="col-sm-6 col-sm-offset-3">
+┊  ┊ 3┊    <legend>View and Edit Your Party Details:</legend>
+┊  ┊ 4┊    <form class="form-horizontal" *ngIf="party" (submit)="saveParty()">
+┊  ┊ 5┊      <div class="form-group">
+┊  ┊ 6┊        <label>Party Name</label>
+┊  ┊ 7┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.name" name="name" class="form-control">
+┊  ┊ 8┊      </div>
 ┊ 4┊ 9┊
-┊ 5┊  ┊  <label>Description</label>
-┊ 6┊  ┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description">
+┊  ┊10┊      <div class="form-group">
+┊  ┊11┊        <label>Description</label>
+┊  ┊12┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.description" name="description" class="form-control">
+┊  ┊13┊      </div>
 ┊ 7┊14┊
-┊ 8┊  ┊  <label>Location</label>
-┊ 9┊  ┊  <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location.name" name="location">
+┊  ┊15┊      <div class="form-group">
+┊  ┊16┊        <label>Location name</label>
+┊  ┊17┊        <input [disabled]="!isOwner" type="text" [(ngModel)]="party.location.name" name="location" class="form-control">
+┊  ┊18┊      </div>
 ┊10┊19┊
-┊11┊  ┊  <button [disabled]="!isOwner" type="submit">Save</button>
-┊12┊  ┊  <a [routerLink]="['/']">Cancel</a>
-┊13┊  ┊</form>
+┊  ┊20┊      <div class="form-group">
+┊  ┊21┊        <button [disabled]="!isOwner" type="submit" class="btn btn-primary">Save</button>
+┊  ┊22┊        <a [routerLink]="['/']" class="btn">Back</a>
+┊  ┊23┊      </div>
+┊  ┊24┊    </form>
 ┊14┊25┊
-┊15┊  ┊<div *ngIf="isOwner || isPublic">
-┊16┊  ┊  <p>Users to invite:</p>
-┊17┊  ┊  <ul>
-┊18┊  ┊    <li *ngFor="let user of users | async">
-┊19┊  ┊      <div>{{user | displayName}}</div>
-┊20┊  ┊      <button (click)="invite(user)">Invite</button>
-┊21┊  ┊    </li>
-┊22┊  ┊  </ul>
-┊23┊  ┊</div>
+┊  ┊26┊    <ul class="ma-invite-list" *ngIf="isOwner || isPublic">
+┊  ┊27┊      <h3>
+┊  ┊28┊        Users to invite:
+┊  ┊29┊      </h3>
+┊  ┊30┊      <li *ngFor="let user of users | async">
+┊  ┊31┊        <div>{{ user | displayName }}</div>
+┊  ┊32┊        <button (click)="invite(user)" class="btn btn-primary btn-sm">Invite</button>
+┊  ┊33┊      </li>
+┊  ┊34┊    </ul>
 ┊24┊35┊
-┊25┊  ┊<div *ngIf="isInvited">
-┊26┊  ┊  <h2>Reply to the invitation</h2>
-┊27┊  ┊  <input type="button" value="I'm going!" (click)="reply('yes')">
-┊28┊  ┊  <input type="button" value="Maybe" (click)="reply('maybe')">
-┊29┊  ┊  <input type="button" value="No" (click)="reply('no')">
-┊30┊  ┊</div>
+┊  ┊36┊    <div *ngIf="isInvited">
+┊  ┊37┊      <h2>Reply to the invitation</h2>
+┊  ┊38┊      <input type="button" class="btn btn-primary" value="I'm going!" (click)="reply('yes')">
+┊  ┊39┊      <input type="button" class="btn btn-warning" value="Maybe" (click)="reply('maybe')">
+┊  ┊40┊      <input type="button" class="btn btn-danger" value="No" (click)="reply('no')">
+┊  ┊41┊    </div>
 ┊31┊42┊
-┊32┊  ┊<sebm-google-map
-┊33┊  ┊  [latitude]="lat || centerLat"
-┊34┊  ┊  [longitude]="lng || centerLng"
-┊35┊  ┊  [zoom]="8"
-┊36┊  ┊  (mapClick)="mapClicked($event)">
-┊37┊  ┊  <sebm-google-map-marker
-┊38┊  ┊    *ngIf="lat && lng"
-┊39┊  ┊    [latitude]="lat"
-┊40┊  ┊    [longitude]="lng">
-┊41┊  ┊  </sebm-google-map-marker>
-┊42┊  ┊</sebm-google-map>🚫↵
+┊  ┊43┊    <h3 class="ma-map-title">
+┊  ┊44┊      Click the map to set the party location
+┊  ┊45┊    </h3>
+┊  ┊46┊
+┊  ┊47┊    <div class="angular-google-map-container">
+┊  ┊48┊      <sebm-google-map
+┊  ┊49┊        [latitude]="lat || centerLat"
+┊  ┊50┊        [longitude]="lng || centerLng"
+┊  ┊51┊        [zoom]="8"
+┊  ┊52┊        (mapClick)="mapClicked($event)">
+┊  ┊53┊        <sebm-google-map-marker
+┊  ┊54┊          *ngIf="lat && lng"
+┊  ┊55┊          [latitude]="lat"
+┊  ┊56┊          [longitude]="lng">
+┊  ┊57┊        </sebm-google-map-marker>
+┊  ┊58┊      </sebm-google-map>
+┊  ┊59┊    </div>
+┊  ┊60┊  </div>
+┊  ┊61┊</div>🚫↵
```
[}]: #


# Summary

So in this chapter of the tutorial we added the Bootstrap library and used it's layout and CSS styles.

We also learned how to integrate SASS compiler with Meteor and how to create isolated SASS styles for each component.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step17.md) | [Next Step >](step19.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #