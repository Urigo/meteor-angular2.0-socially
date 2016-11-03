[{]: <region> (header)
# Step 22: Mobile Support & Packages Isolation
[}]: #
[{]: <region> (body)
This step of the tutorial teaches us how to add mobile support for iOS and Android and how to elegantly reuse code using the es2015 modules.

In this tutorial's example we will differentiate the login part of the project: in the browser users will login using email and password and in the mobile app users will login with SMS verification.

### Adding mobile support for the project:

To add mobile support, select the platform(s) you want and run the following command:

    $ meteor add-platform ios
    # OR / AND
    $ meteor add-platform android

And now to run in the emulator, run:

    $ meteor run ios
    # OR
    $ meteor run android

You can also run in a real mobile device, for more instructions, read the ["Mobile" chapter](http://guide.meteor.com/mobile.html) of the Official Meteor Guide.

Before we can run Meteor and Angular 2 on mobile platform, we need to make sure that our Angular 2 NgModule initialized only when Meteor platform declares that it's ready, to do so, let's wrap the `bootstrapModule` with `Meteor.startup`:

[{]: <helper> (diff_step 22.2)
#### Step 22.2: Wrapped Angular 2 bootstrap with Meteor startup

##### Changed client/main.ts
```diff
@@ -6,5 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import '../both/methods/parties.methods';
 ┊ 8┊ 8┊
-┊ 9┊  ┊const platform = platformBrowserDynamic();
-┊10┊  ┊platform.bootstrapModule(AppModule);🚫↵
+┊  ┊ 9┊Meteor.startup(() => {
+┊  ┊10┊  const platform = platformBrowserDynamic();
+┊  ┊11┊  platform.bootstrapModule(AppModule);
+┊  ┊12┊});🚫↵
```
[}]: #

### Creating Mobile/Web Separation

We're going to keep the view and the component for the web under `*.component.web.html` and `*.component.web.ts` and doing the same for `*.component.mobile.html` and `*.component.mobile.ts`.

First thing to do is to rename `login.component.html` to `login.component.web.html`:

[{]: <helper> (diff_step 22.3)
#### Step 22.3: Rename to login.web.component.html

##### Changed client/imports/app/auth/login.component.html

[}]: #

Let's do the same with `login.component.ts` file:

[{]: <helper> (diff_step 22.4)
#### Step 22.4: Do the same for login.component.ts

##### Changed client/imports/app/auth/login.component.ts

[}]: #

with one small change which is a new `template` property:

[{]: <helper> (diff_step 22.5)
#### Step 22.5: Update the template

##### Changed client/imports/app/auth/login.component.web.ts
```diff
@@ -3,7 +3,7 @@
 ┊3┊3┊import { Router } from '@angular/router';
 ┊4┊4┊import { Meteor } from 'meteor/meteor';
 ┊5┊5┊
-┊6┊ ┊import template from './login.component.html';
+┊ ┊6┊import template from './login.component.web.html';
 ┊7┊7┊
 ┊8┊8┊@Component({
 ┊9┊9┊  selector: 'login',
```
[}]: #

And let's update the imports in the index file:

[{]: <helper> (diff_step 22.6)
#### Step 22.6: Update the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import {LoginComponent} from "./login.component";
+┊ ┊1┊import {LoginComponent} from "./login.component.web";
 ┊2┊2┊import {SignupComponent} from "./signup.component";
 ┊3┊3┊import {RecoverComponent} from "./recover.component";
```
[}]: #

### SMS verification

As I mentioned before, we're going to use SMS verification to log in a user on the mobile application.

There is a package for that!

We will use an external package that extends Meteor's Accounts, called [accounts-phone](https://atmospherejs.com/okland/accounts-phone) that verifies phone number with SMS message, so let's add it:

    $ meteor add mys:accounts-phone

> Note that in development mode - the SMS will not be sent - and the verification code will be printed to the Meteor log.

**We can now move on to create a mobile version Login Component.**

A template of a mobile version will be pretty much the same as for browsers:

[{]: <helper> (diff_step 22.8)
#### Step 22.8: Create a view for the mobile login

##### Added client/imports/app/auth/login.component.mobile.html
```diff
@@ -0,0 +1,19 @@
+┊  ┊ 1┊<div class="md-content" layout="row" layout-align="center start" layout-fill layout-margin>
+┊  ┊ 2┊  <div layout="column" flex flex-md="50" flex-lg="50" flex-gt-lg="33" class="md-whiteframe-z2" layout-fill>
+┊  ┊ 3┊    <md-toolbar class="md-primary" color="primary">
+┊  ┊ 4┊      Sign in
+┊  ┊ 5┊    </md-toolbar>
+┊  ┊ 6┊
+┊  ┊ 7┊    <div layout="column" layout-fill layout-margin layout-padding>
+┊  ┊ 8┊      <div layout="row" layout-fill layout-margin>
+┊  ┊ 9┊        <p class="md-body-2"> Sign in with SMS</p>
+┊  ┊10┊      </div>
+┊  ┊11┊
+┊  ┊12┊      <div [hidden]="error == ''">
+┊  ┊13┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
+┊  ┊14┊          <p class="md-body-1">{{ error }}</p>
+┊  ┊15┊        </md-toolbar>
+┊  ┊16┊      </div>
+┊  ┊17┊    </div>
+┊  ┊18┊  </div>
+┊  ┊19┊</div>🚫↵
```
[}]: #

We can use the same directives in the component as in Web version, so let's create a basic component without any functionality:

[{]: <helper> (diff_step 22.9)
#### Step 22.9: Create mobile version of Login component

##### Added client/imports/app/auth/login.component.mobile.ts
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { Component, OnInit } from '@angular/core';
+┊  ┊ 2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
+┊  ┊ 3┊import { Router } from '@angular/router';
+┊  ┊ 4┊
+┊  ┊ 5┊import template from './login.component.mobile.html';
+┊  ┊ 6┊
+┊  ┊ 7┊@Component({
+┊  ┊ 8┊  selector: 'login',
+┊  ┊ 9┊  template
+┊  ┊10┊})
+┊  ┊11┊export class MobileLoginComponent implements OnInit {
+┊  ┊12┊  error: string = '';
+┊  ┊13┊
+┊  ┊14┊  constructor(private router: Router, private formBuilder: FormBuilder) {}
+┊  ┊15┊
+┊  ┊16┊  ngOnInit() {}
+┊  ┊17┊}🚫↵
```
[}]: #

SMS verification is a two-step process. First thing to do is to verify a phone number.

Let's create a form for that:

[{]: <helper> (diff_step 22.10)
#### Step 22.10: Add a form with phone number to provide

##### Changed client/imports/app/auth/login.component.mobile.html
```diff
@@ -9,6 +9,16 @@
 ┊ 9┊ 9┊        <p class="md-body-2"> Sign in with SMS</p>
 ┊10┊10┊      </div>
 ┊11┊11┊
+┊  ┊12┊      <form [formGroup]="phoneForm" #f="ngForm" (ngSubmit)="send()"
+┊  ┊13┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊14┊
+┊  ┊15┊        <md-input formControlName="phone" type="text" placeholder="Phone"></md-input>
+┊  ┊16┊
+┊  ┊17┊        <div layout="row" layout-align="space-between center">
+┊  ┊18┊          <button md-raised-button class="md-primary" type="submit" aria-label="send">Send SMS</button>
+┊  ┊19┊        </div>
+┊  ┊20┊      </form>
+┊  ┊21┊
 ┊12┊22┊      <div [hidden]="error == ''">
 ┊13┊23┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
 ┊14┊24┊          <p class="md-body-1">{{ error }}</p>
```
[}]: #

It's a simple form, basically the same as the form with Email and password verification we did in previous chapters.

We can now take care of the logic. Let's create a `send` method:

[{]: <helper> (diff_step 22.11)
#### Step 22.11: Implement a phone number verification

##### Changed client/imports/app/auth/login.component.mobile.ts
```diff
@@ -1,6 +1,7 @@
-┊1┊ ┊import { Component, OnInit } from '@angular/core';
+┊ ┊1┊import {Component, OnInit, NgZone} from '@angular/core';
 ┊2┊2┊import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 ┊3┊3┊import { Router } from '@angular/router';
+┊ ┊4┊import { Accounts } from 'meteor/accounts-base';
 ┊4┊5┊
 ┊5┊6┊import template from './login.component.mobile.html';
 ┊6┊7┊
```
```diff
@@ -10,8 +11,29 @@
 ┊10┊11┊})
 ┊11┊12┊export class MobileLoginComponent implements OnInit {
 ┊12┊13┊  error: string = '';
+┊  ┊14┊  phoneForm: FormGroup;
+┊  ┊15┊  phone: string;
 ┊13┊16┊
-┊14┊  ┊  constructor(private router: Router, private formBuilder: FormBuilder) {}
+┊  ┊17┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
 ┊15┊18┊
-┊16┊  ┊  ngOnInit() {}
+┊  ┊19┊  ngOnInit() {
+┊  ┊20┊    this.phoneForm = this.formBuilder.group({
+┊  ┊21┊      phone: ['', Validators.required]
+┊  ┊22┊    });
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  send() {
+┊  ┊26┊    if (this.phoneForm.valid) {
+┊  ┊27┊      Accounts.requestPhoneVerification(this.phoneForm.value.phone, (err) => {
+┊  ┊28┊        this.zone.run(() => {
+┊  ┊29┊          if (err) {
+┊  ┊30┊            this.error = err.reason || err;
+┊  ┊31┊          } else {
+┊  ┊32┊            this.phone = this.phoneForm.value.phone;
+┊  ┊33┊            this.error = '';
+┊  ┊34┊          }
+┊  ┊35┊        });
+┊  ┊36┊      });
+┊  ┊37┊    }
+┊  ┊38┊  }
 ┊17┊39┊}🚫↵
```
[}]: #

What we did? Few things:

* form called `phoneForm` with one field `phone`.
* `send` method that calls `Accounts.requestPhoneVerification` to verify phone number and to send SMS with verification code.
* we're also keeping phone number outside the form's scope.

Great, we're half way there!

Now we need to verify that code. We will keep all the logic under `verify` method:

[{]: <helper> (diff_step 22.12)
#### Step 22.12: Implement a code verification

##### Changed client/imports/app/auth/login.component.mobile.ts
```diff
@@ -13,6 +13,8 @@
 ┊13┊13┊  error: string = '';
 ┊14┊14┊  phoneForm: FormGroup;
 ┊15┊15┊  phone: string;
+┊  ┊16┊  verifyForm: FormGroup;
+┊  ┊17┊  isStepTwo: boolean = false;
 ┊16┊18┊
 ┊17┊19┊  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}
 ┊18┊20┊
```
```diff
@@ -20,6 +22,10 @@
 ┊20┊22┊    this.phoneForm = this.formBuilder.group({
 ┊21┊23┊      phone: ['', Validators.required]
 ┊22┊24┊    });
+┊  ┊25┊
+┊  ┊26┊    this.verifyForm = this.formBuilder.group({
+┊  ┊27┊        code: ['', Validators.required]
+┊  ┊28┊    });
 ┊23┊29┊  }
 ┊24┊30┊
 ┊25┊31┊  send() {
```
```diff
@@ -31,6 +37,23 @@
 ┊31┊37┊          } else {
 ┊32┊38┊            this.phone = this.phoneForm.value.phone;
 ┊33┊39┊            this.error = '';
+┊  ┊40┊            this.isStepTwo = true;
+┊  ┊41┊          }
+┊  ┊42┊        });
+┊  ┊43┊      });
+┊  ┊44┊    }
+┊  ┊45┊  }
+┊  ┊46┊
+┊  ┊47┊
+┊  ┊48┊  verify() {
+┊  ┊49┊    if (this.verifyForm.valid) {
+┊  ┊50┊      Accounts.verifyPhone(this.phone, this.verifyForm.value.code, (err) => {
+┊  ┊51┊        this.zone.run(() => {
+┊  ┊52┊          if (err) {
+┊  ┊53┊            this.error = err.reason || err;
+┊  ┊54┊          }
+┊  ┊55┊          else {
+┊  ┊56┊            this.router.navigate(['/']);
 ┊34┊57┊          }
 ┊35┊58┊        });
 ┊36┊59┊      });
```
[}]: #

As you can see, we used `Accounts.verifyPhone` with proper arguments to call the verification process.

There are two more things that you should notice.

* New property `isStepTwo` that holds the status of sign in process. Based on that property we can tell if someone is still in the first phase or he already wants to verify code sent via SMS.
* Redirection to `PartiesList` if verification succeed.

We have all the logic, we still need to create a view for it:

[{]: <helper> (diff_step 22.13)
#### Step 22.13: Create a form with code verification

##### Changed client/imports/app/auth/login.component.mobile.html
```diff
@@ -9,7 +9,7 @@
 ┊ 9┊ 9┊        <p class="md-body-2"> Sign in with SMS</p>
 ┊10┊10┊      </div>
 ┊11┊11┊
-┊12┊  ┊      <form [formGroup]="phoneForm" #f="ngForm" (ngSubmit)="send()"
+┊  ┊12┊      <form [formGroup]="phoneForm" *ngIf="!isStepTwo" #f="ngForm" (ngSubmit)="send()"
 ┊13┊13┊            layout="column" layout-fill layout-padding layout-margin>
 ┊14┊14┊
 ┊15┊15┊        <md-input formControlName="phone" type="text" placeholder="Phone"></md-input>
```
```diff
@@ -19,6 +19,16 @@
 ┊19┊19┊        </div>
 ┊20┊20┊      </form>
 ┊21┊21┊
+┊  ┊22┊      <form *ngIf="isStepTwo" [formGroup]="verifyForm" #f="ngForm" (ngSubmit)="verify()"
+┊  ┊23┊            layout="column" layout-fill layout-padding layout-margin>
+┊  ┊24┊
+┊  ┊25┊        <md-input formControlName="code" type="text" placeholder="Code"></md-input>
+┊  ┊26┊
+┊  ┊27┊        <div layout="row" layout-align="space-between center">
+┊  ┊28┊          <button md-raised-button class="md-primary" type="submit" aria-label="verify">Verify code</button>
+┊  ┊29┊        </div>
+┊  ┊30┊      </form>
+┊  ┊31┊
 ┊22┊32┊      <div [hidden]="error == ''">
 ┊23┊33┊        <md-toolbar class="md-warn" layout="row" layout-fill layout-padding layout-margin>
 ┊24┊34┊          <p class="md-body-1">{{ error }}</p>
```
[}]: #

And let's add the mobile version of the Component to the index file:

[{]: <helper> (diff_step 22.14)
#### Step 22.14: Added MobileLoginComponent to the index file

##### Changed client/imports/app/auth/index.ts
```diff
@@ -1,9 +1,11 @@
 ┊ 1┊ 1┊import {LoginComponent} from "./login.component.web";
 ┊ 2┊ 2┊import {SignupComponent} from "./signup.component";
 ┊ 3┊ 3┊import {RecoverComponent} from "./recover.component";
+┊  ┊ 4┊import {MobileLoginComponent} from "./login.component.mobile";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const AUTH_DECLARATIONS = [
 ┊ 6┊ 7┊  LoginComponent,
 ┊ 7┊ 8┊  SignupComponent,
-┊ 8┊  ┊  RecoverComponent
+┊  ┊ 9┊  RecoverComponent,
+┊  ┊10┊  MobileLoginComponent
 ┊ 9┊11┊];
```
[}]: #

It seems like both versions are ready.

We can now move on to `client/app.routes.ts`.

Just as you can use `Meteor.isServer` and `Meteor.isClient` to separate your client-side and server-side code, you can use `Meteor.isCordova` to separate your Cordova-specific code from the rest of your code.

[{]: <helper> (diff_step 22.15)
#### Step 22.15: Choose mobile or web version

##### Changed client/imports/app/app.routes.ts
```diff
@@ -3,14 +3,15 @@
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊import { PartiesListComponent } from './parties/parties-list.component';
 ┊ 5┊ 5┊import { PartyDetailsComponent } from './parties/party-details.component';
-┊ 6┊  ┊import {LoginComponent} from "./auth/login.component";
 ┊ 7┊ 6┊import {SignupComponent} from "./auth/signup.component";
 ┊ 8┊ 7┊import {RecoverComponent} from "./auth/recover.component";
+┊  ┊ 8┊import {MobileLoginComponent} from "./auth/login.component.mobile";
+┊  ┊ 9┊import {LoginComponent} from "./auth/login.component.web";
 ┊ 9┊10┊
 ┊10┊11┊export const routes: Route[] = [
 ┊11┊12┊  { path: '', component: PartiesListComponent },
 ┊12┊13┊  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
-┊13┊  ┊  { path: 'login', component: LoginComponent },
+┊  ┊14┊  { path: 'login', component: Meteor.isCordova ? MobileLoginComponent : LoginComponent },
 ┊14┊15┊  { path: 'signup', component: SignupComponent },
 ┊15┊16┊  { path: 'recover', component: RecoverComponent }
 ┊16┊17┊];
```
[}]: #

As you can see, we're importing both version of Login Component. But only one is being used, depending on Meteor.isCordova value.

If we would run Socially in a browser `LoginComponent` for web platform will be used.

And that's it!


## Summary

In this tutorial we showed how to make our code behave differently in mobile and web platforms. We did this by creating separate es2015 modules with specific code for mobile and web, and using them based on the platform that runs the application.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step21.md) | [Next Step >](step23.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #