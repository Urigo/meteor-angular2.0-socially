[{]: <region> (header)
# Step 15: Meteor methods
[}]: #
[{]: <region> (body)
In this step we will learn how to use Meteor Methods to
implement server side logic of the party invitation feature.

> A capital "M" will be used with Meteor "M"ethods to avoid confusion with Javascript function methods

Meteor Methods are a more secure and reliable way to
implement complex logic on the server side in comparison to the direct
manipulations of Mongo collections. Also, we'll touch briefly on
Meteor's UI latency compensation mechanism that comes with these Methods.
This is one of the great Meteor concepts that allows for rapid UI changes.

# Invitation Method

Let's create a new file `both/methods/parties.methods.ts`, and add the following `invite` Meteor Method:

[{]: <helper> (diff_step 15.1)
#### Step 15.1: Add a party invitation method

##### Added both/methods/parties.methods.ts
```diff
@@ -0,0 +1,47 @@
+┊  ┊ 1┊import {Parties} from '../collections/parties.collection';
+┊  ┊ 2┊import {Email} from 'meteor/email';
+┊  ┊ 3┊import {check} from 'meteor/check';
+┊  ┊ 4┊import {Meteor} from 'meteor/meteor';
+┊  ┊ 5┊
+┊  ┊ 6┊function getContactEmail(user:Meteor.User):string {
+┊  ┊ 7┊  if (user.emails && user.emails.length)
+┊  ┊ 8┊    return user.emails[0].address;
+┊  ┊ 9┊
+┊  ┊10┊  return null;
+┊  ┊11┊}
+┊  ┊12┊
+┊  ┊13┊Meteor.methods({
+┊  ┊14┊  invite: function (partyId:string, userId:string) {
+┊  ┊15┊    check(partyId, String);
+┊  ┊16┊    check(userId, String);
+┊  ┊17┊
+┊  ┊18┊    let party = Parties.collection.findOne(partyId);
+┊  ┊19┊
+┊  ┊20┊    if (!party)
+┊  ┊21┊      throw new Meteor.Error('404', 'No such party!');
+┊  ┊22┊
+┊  ┊23┊    if (party.public)
+┊  ┊24┊      throw new Meteor.Error('400', 'That party is public. No need to invite people.');
+┊  ┊25┊
+┊  ┊26┊    if (party.owner !== this.userId)
+┊  ┊27┊      throw new Meteor.Error('403', 'No permissions!');
+┊  ┊28┊
+┊  ┊29┊    if (userId !== party.owner && (party.invited || []).indexOf(userId) == -1) {
+┊  ┊30┊      Parties.collection.update(partyId, {$addToSet: {invited: userId}});
+┊  ┊31┊
+┊  ┊32┊      let from = getContactEmail(Meteor.users.findOne(this.userId));
+┊  ┊33┊      let to = getContactEmail(Meteor.users.findOne(userId));
+┊  ┊34┊
+┊  ┊35┊      if (Meteor.isServer && to) {
+┊  ┊36┊        Email.send({
+┊  ┊37┊          from: 'noreply@socially.com',
+┊  ┊38┊          to: to,
+┊  ┊39┊          replyTo: from || undefined,
+┊  ┊40┊          subject: 'PARTY: ' + party.name,
+┊  ┊41┊          text: `Hi, I just invited you to ${party.name} on Socially.
+┊  ┊42┊                        \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
+┊  ┊43┊        });
+┊  ┊44┊      }
+┊  ┊45┊    }
+┊  ┊46┊  }
+┊  ┊47┊});🚫↵
```
[}]: #

We used a special API method `Meteor.methods` to register
a new Meteor Method. Again, don't forget to import your created `parties.methods.ts` module
in the server's `main.ts` module to have the Methods defined properly:

[{]: <helper> (diff_step 15.2)
#### Step 15.2: Import methods on the server side

##### Changed server/main.ts
```diff
@@ -3,7 +3,8 @@
 ┊ 3┊ 3┊import { loadParties } from './imports/fixtures/parties';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import './imports/publications/parties';
-┊ 6┊  ┊import './imports/publications/users'; 
+┊  ┊ 6┊import './imports/publications/users';
+┊  ┊ 7┊import '../both/methods/parties.methods';
 ┊ 7┊ 8┊
 ┊ 8┊ 9┊Meteor.startup(() => {
 ┊ 9┊10┊  loadParties();
```
[}]: #

### Latency Compensation

UI Latency compensation is one of the features that makes Meteor stand out amongst most other Web frameworks, thanks again to the isomorphic environment and Meteor Methods.
In short, visual changes are applied immediately as a response to some user action,
even before the server responds to anything. If you want to read up more about how the view can securely be updated
even before the server is contacted proceed to an [Introduction to Latency Compensation](https://meteorhacks.com/introduction-to-latency-compensation) written by Arunoda.

But to make it happen, we need to define our Methods on the client side as well. Let's import our Methods in `client/main.ts`:

[{]: <helper> (diff_step 15.3)
#### Step 15.3: Import methods on the client side

##### Changed client/main.ts
```diff
@@ -4,5 +4,7 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { AppModule } from './imports/app/app.module';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import '../both/methods/parties.methods';
+┊  ┊ 8┊
 ┊ 7┊ 9┊const platform = platformBrowserDynamic();
 ┊ 8┊10┊platform.bootstrapModule(AppModule);🚫↵
```
[}]: #

### Validating Methods with Check

As you can see, we've also done a lot of checks to verify that
all arguments passed down to the method are valid.

First the validity of the arguments' types are checked, and then
the business logic associated with them is checked.

Type validation checks, which are essential for the JavaScript methods dealing with the storage's data,
are done with the help of a handy Meteor's package called ["check"](https://atmospherejs.com/meteor/check).

    meteor add check

Then, if everything is valid, we send an invitation email.
Here we are using another handy Meteor's package titled ["email"](https://atmospherejs.com/meteor/email).

    meteor add email

At this point, we are ready to add a call to the new Method from the client.

Let's add a new button right after each username or email in that
list of users to invite in the `PartyDetails`'s template:

[{]: <helper> (diff_step 15.5)
#### Step 15.5: Add invite method

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -16,5 +16,6 @@
 ┊16┊16┊<ul>
 ┊17┊17┊  <li *ngFor="let user of users | async">
 ┊18┊18┊    <div>{{user | displayName}}</div>
+┊  ┊19┊    <button (click)="invite(user)">Invite</button>
 ┊19┊20┊  </li>
 ┊20┊21┊</ul>
```
[}]: #

And then, change the component to handle the click event and invite a user:

[{]: <helper> (diff_step 15.6)
#### Step 15.6: Add the click handler in the Component

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -73,6 +73,14 @@
 ┊73┊73┊    });
 ┊74┊74┊  }
 ┊75┊75┊
+┊  ┊76┊  invite(user: Meteor.User) {
+┊  ┊77┊    MeteorObservable.call('invite', this.party._id, user._id).subscribe(() => {
+┊  ┊78┊      alert('User successfully invited.');
+┊  ┊79┊    }, (error) => {
+┊  ┊80┊      alert(`Failed to invite due to ${error}`);
+┊  ┊81┊    });
+┊  ┊82┊  }
+┊  ┊83┊
 ┊76┊84┊  ngOnDestroy() {
 ┊77┊85┊    this.paramsSub.unsubscribe();
 ┊78┊86┊    this.partySub.unsubscribe();
```
[}]: #

> We used `MeteorObservable.call` which triggers a Meteor server method, which triggers `next` callback when the server returns a response, and `error` when the server returns an error.

### Updating Invited Users Reactively

One more thing before we are done with the party owner's invitation
logic. We, of course, would like to make this list of users
change reactively, i.e. each user disappears from the list
when the invitation has been sent successfully.

It's worth mentioning that each party should change appropriately
when we invite a user — the party `invited` array should update
in the local Mongo storage. If we wrap the line where
we get the new party with the `MeteorObservable.autorun` method, this code should
re-run reactively:

[{]: <helper> (diff_step 15.7)
#### Step 15.7: Get the party reactively

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -41,7 +41,9 @@
 ┊41┊41┊        }
 ┊42┊42┊
 ┊43┊43┊        this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
-┊44┊  ┊          this.party = Parties.findOne(this.partyId);
+┊  ┊44┊          MeteorObservable.autorun().subscribe(() => {
+┊  ┊45┊            this.party = Parties.findOne(this.partyId);
+┊  ┊46┊          });
 ┊45┊47┊        });
 ┊46┊48┊
 ┊47┊49┊        if (this.uninvitedSub) {
```
[}]: #

> Now each time the Party object changes, we will re-fetch it from the collection and assign it to the Component property. Our view known to update itself's because we used `zone()` operator in order to connect between Meteor data and Angular change detection.

Now its time to update our users list.
We'll move the line that gets the users list into a
separate method, provided with the list of IDs of already invited users;
and call it whenever we need: right in the above `MeteorObservable.autorun` method after the party assignment and in the subscription, like that:

[{]: <helper> (diff_step 15.8)
#### Step 15.8: Update the users list reactively

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -43,6 +43,7 @@
 ┊43┊43┊        this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
 ┊44┊44┊          MeteorObservable.autorun().subscribe(() => {
 ┊45┊45┊            this.party = Parties.findOne(this.partyId);
+┊  ┊46┊            this.getUsers(this.party);
 ┊46┊47┊          });
 ┊47┊48┊        });
 ┊48┊49┊
```
```diff
@@ -51,15 +52,22 @@
 ┊51┊52┊        }
 ┊52┊53┊
 ┊53┊54┊        this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.partyId).subscribe(() => {
-┊54┊  ┊           this.users = Users.find({
-┊55┊  ┊             _id: {
-┊56┊  ┊               $ne: Meteor.userId()
-┊57┊  ┊              }
-┊58┊  ┊            }).zone();
+┊  ┊55┊          this.getUsers(this.party);
 ┊59┊56┊        });
 ┊60┊57┊      });
 ┊61┊58┊  }
 ┊62┊59┊
+┊  ┊60┊  getUsers(party: Party) {
+┊  ┊61┊    if (party) {
+┊  ┊62┊      this.users = Users.find({
+┊  ┊63┊        _id: {
+┊  ┊64┊          $nin: party.invited || [],
+┊  ┊65┊          $ne: Meteor.userId()
+┊  ┊66┊        }
+┊  ┊67┊      }).zone();
+┊  ┊68┊    }
+┊  ┊69┊  }
+┊  ┊70┊
 ┊63┊71┊  saveParty() {
 ┊64┊72┊    if (!Meteor.userId()) {
 ┊65┊73┊      alert('Please log in to change this party');
```
[}]: #

Here comes test time. Let's add a couple of new users.
Then login as an old user and add a new party.
Go to the party: you should see a list of all users including
newly created ones. Invite several of them — each item in the list
should disappear after a successful invitation.

What's important to notice here is that each user item in the users list
disappears right after the click, even before the message about
the invitation was successfully sent. That's the latency compensation at work!

# User Reply

Here we are going to implement the user reply to the party invitation request.

First of all, let's make parties list a bit more secure,
which means two things: showing private parties to those who have been invited
or to owners, and elaborate routing activation defense for the party details view:

[{]: <helper> (diff_step 15.9)
#### Step 15.9: Show private parties to the invited and owners only

##### Changed server/imports/publications/parties.ts
```diff
@@ -36,6 +36,12 @@
 ┊36┊36┊          $exists: true
 ┊37┊37┊        }
 ┊38┊38┊      }]
+┊  ┊39┊    },
+┊  ┊40┊    {
+┊  ┊41┊      $and: [
+┊  ┊42┊        { invited: this.userId },
+┊  ┊43┊        { invited: { $exists: true } }
+┊  ┊44┊      ]
 ┊39┊45┊    }]
 ┊40┊46┊  };
```
[}]: #

The next thing is a party invitee response to the invitation itself. Here, as usual,
we'll need to update the server side and UI. For the server,
let's add a new `reply` Meteor Method:

[{]: <helper> (diff_step 15.10)
#### Step 15.10: Add a reply method

##### Changed both/methods/parties.methods.ts
```diff
@@ -43,5 +43,50 @@
 ┊43┊43┊        });
 ┊44┊44┊      }
 ┊45┊45┊    }
+┊  ┊46┊  },
+┊  ┊47┊  reply: function(partyId: string, rsvp: string) {
+┊  ┊48┊    check(partyId, String);
+┊  ┊49┊    check(rsvp, String);
+┊  ┊50┊
+┊  ┊51┊    if (!this.userId)
+┊  ┊52┊      throw new Meteor.Error('403', 'You must be logged-in to reply');
+┊  ┊53┊
+┊  ┊54┊    if (['yes', 'no', 'maybe'].indexOf(rsvp) === -1)
+┊  ┊55┊      throw new Meteor.Error('400', 'Invalid RSVP');
+┊  ┊56┊
+┊  ┊57┊    let party = Parties.findOne({ _id: partyId });
+┊  ┊58┊
+┊  ┊59┊    if (!party)
+┊  ┊60┊      throw new Meteor.Error('404', 'No such party');
+┊  ┊61┊
+┊  ┊62┊    if (party.owner === this.userId)
+┊  ┊63┊      throw new Meteor.Error('500', 'You are the owner!');
+┊  ┊64┊
+┊  ┊65┊    if (!party.public && (!party.invited || party.invited.indexOf(this.userId) == -1))
+┊  ┊66┊      throw new Meteor.Error('403', 'No such party'); // its private, but let's not tell this to the user
+┊  ┊67┊
+┊  ┊68┊    let rsvpIndex = party.rsvps ? party.rsvps.findIndex((rsvp) => rsvp.userId === this.userId) : -1;
+┊  ┊69┊
+┊  ┊70┊    if (rsvpIndex !== -1) {
+┊  ┊71┊      // update existing rsvp entry
+┊  ┊72┊      if (Meteor.isServer) {
+┊  ┊73┊        // update the appropriate rsvp entry with $
+┊  ┊74┊        Parties.update(
+┊  ┊75┊          { _id: partyId, 'rsvps.userId': this.userId },
+┊  ┊76┊          { $set: { 'rsvps.$.response': rsvp } });
+┊  ┊77┊      } else {
+┊  ┊78┊        // minimongo doesn't yet support $ in modifier. as a temporary
+┊  ┊79┊        // workaround, make a modifier that uses an index. this is
+┊  ┊80┊        // safe on the client since there's only one thread.
+┊  ┊81┊        let modifier = { $set: {} };
+┊  ┊82┊        modifier.$set['rsvps.' + rsvpIndex + '.response'] = rsvp;
+┊  ┊83┊
+┊  ┊84┊        Parties.update(partyId, modifier);
+┊  ┊85┊      }
+┊  ┊86┊    } else {
+┊  ┊87┊      // add new rsvp entry
+┊  ┊88┊      Parties.update(partyId,
+┊  ┊89┊        { $push: { rsvps: { userId: this.userId, response: rsvp } } });
+┊  ┊90┊    }
 ┊46┊91┊  }
 ┊47┊92┊});🚫↵
```
[}]: #

As you can see, a new property, called "rsvp", was added
above to collect user responses of this particular party.
One more thing. Let's update the party declaration file to
make TypeScript resolve and compile with no warnings:

[{]: <helper> (diff_step 15.11)
#### Step 15.11: Add RSVP interface

##### Changed both/models/party.model.ts
```diff
@@ -7,4 +7,10 @@
 ┊ 7┊ 7┊  owner?: string;
 ┊ 8┊ 8┊  public: boolean;
 ┊ 9┊ 9┊  invited?: string[];
+┊  ┊10┊  rsvps?: RSVP[];
 ┊10┊11┊}
+┊  ┊12┊
+┊  ┊13┊interface RSVP {
+┊  ┊14┊  userId: string;
+┊  ┊15┊  response: string;
+┊  ┊16┊}🚫↵
```
[}]: #

For the UI, let's add three new buttons onto the party details view.
These will be "yes", "no", "maybe" buttons and users responses accordingly:

[{]: <helper> (diff_step 15.12)
#### Step 15.12: Add reponse buttons

##### Changed client/imports/app/parties/party-details.component.html
```diff
@@ -19,3 +19,10 @@
 ┊19┊19┊    <button (click)="invite(user)">Invite</button>
 ┊20┊20┊  </li>
 ┊21┊21┊</ul>
+┊  ┊22┊
+┊  ┊23┊<div>
+┊  ┊24┊  <h2>Reply to the invitation</h2>
+┊  ┊25┊  <input type="button" value="I'm going!" (click)="reply('yes')">
+┊  ┊26┊  <input type="button" value="Maybe" (click)="reply('maybe')">
+┊  ┊27┊  <input type="button" value="No" (click)="reply('no')">
+┊  ┊28┊</div>
```
[}]: #

Then, handle click events in the PartyDetails component:

[{]: <helper> (diff_step 15.13)
#### Step 15.13: Add reply method to PartyDetails component

##### Changed client/imports/app/parties/party-details.component.ts
```diff
@@ -91,6 +91,14 @@
 ┊ 91┊ 91┊    });
 ┊ 92┊ 92┊  }
 ┊ 93┊ 93┊
+┊   ┊ 94┊  reply(rsvp: string) {
+┊   ┊ 95┊    MeteorObservable.call('reply', this.party._id, rsvp).subscribe(() => {
+┊   ┊ 96┊      alert('You successfully replied.');
+┊   ┊ 97┊    }, (error) => {
+┊   ┊ 98┊      alert(`Failed to reply due to ${error}`);
+┊   ┊ 99┊    });
+┊   ┊100┊  }
+┊   ┊101┊
 ┊ 94┊102┊  ngOnDestroy() {
 ┊ 95┊103┊    this.paramsSub.unsubscribe();
 ┊ 96┊104┊    this.partySub.unsubscribe();
```
[}]: #

### Rsvp Pipe

Last, but not the least, let's show statistics of the invitation responses for the party owner.
Let's imagine that any party owner
would like to know the total number of those who declined, accepted, or remain tentative.
This is a perfect use case to add a new stateful pipe, which takes as
an input a party and a one of the RSVP responses, and calculates the total number of responses
associated with this, provided as a parameter we'll call "response".

Add a new pipe to the `client/imports/app/shared/rsvp.pipe.ts` as follows:

[{]: <helper> (diff_step 15.14)
#### Step 15.14: Add a new response counting pipe

##### Added client/imports/app/shared/rsvp.pipe.ts
```diff
@@ -0,0 +1,22 @@
+┊  ┊ 1┊import {Pipe, PipeTransform} from '@angular/core';
+┊  ┊ 2┊import {Party} from "../../../../both/models/party.model";
+┊  ┊ 3┊import {Parties} from "../../../../both/collections/parties.collection";
+┊  ┊ 4┊
+┊  ┊ 5┊@Pipe({
+┊  ┊ 6┊  name: 'rsvp'
+┊  ┊ 7┊})
+┊  ┊ 8┊export class RsvpPipe implements PipeTransform {
+┊  ┊ 9┊  transform(party: Party, type: string): number {
+┊  ┊10┊    if (!type) {
+┊  ┊11┊      return 0;
+┊  ┊12┊    }
+┊  ┊13┊
+┊  ┊14┊    let total = 0;
+┊  ┊15┊    const found = Parties.findOne(party._id);
+┊  ┊16┊
+┊  ┊17┊    if (found)
+┊  ┊18┊      total = found.rsvps ? found.rsvps.filter(rsvp => rsvp.response === type).length : 0;
+┊  ┊19┊
+┊  ┊20┊    return total;
+┊  ┊21┊  }
+┊  ┊22┊}🚫↵
```
[}]: #

The RSVP Pipe fetches the party and returns the count of `rsvps` Array, due the fact that we binded the change detection of Angular 2 and the Meteor data change, each time the data changes, Angular 2 renders the view again, and the RSVP Pipe will run again and update the view with the new number.

It's also worth mentioning that the arguments of a Pipe implementation inside a template are passed to the `transform` method in the same form. Only difference is that the first argument of `transform` is a value to be transformed. In our case, passed only the RSVP response, hence, we are taking the first
value in the list.

An example:

```js
// usage: text | subStr:20:50
@Pipe({name: 'subStr'})
class SubStrPipe implements PipeTransform {
  transform(text: string, starts: number, ends: number) {
    return text.substring(starts, ends);
  }
}
```

Let's make use of this pipe in the `PartiesList` component:

[{]: <helper> (diff_step 15.15)
#### Step 15.15: Display response statistics on the list

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -20,6 +20,12 @@
 ┊20┊20┊      <p>{{party.description}}</p>
 ┊21┊21┊      <p>{{party.location}}</p>
 ┊22┊22┊      <button (click)="removeParty(party)">X</button>
+┊  ┊23┊      <div>
+┊  ┊24┊        Who is coming:
+┊  ┊25┊        Yes - {{party | rsvp:'yes'}}
+┊  ┊26┊        Maybe - {{party | rsvp:'maybe'}}
+┊  ┊27┊        No - {{party | rsvp:'no'}}
+┊  ┊28┊      </div>
 ┊23┊29┊    </li>
 ┊24┊30┊  </ul>
```
[}]: #

And let's add the new Pipe to the shared declarations file:

[{]: <helper> (diff_step 15.16)
#### Step 15.16: Import RsvpPipe

##### Changed client/imports/app/shared/index.ts
```diff
@@ -1,5 +1,7 @@
 ┊1┊1┊import { DisplayNamePipe } from './display-name.pipe';
+┊ ┊2┊import {RsvpPipe} from "./rsvp.pipe";
 ┊2┊3┊
 ┊3┊4┊export const SHARED_DECLARATIONS: any[] = [
-┊4┊ ┊  DisplayNamePipe
+┊ ┊5┊  DisplayNamePipe,
+┊ ┊6┊  RsvpPipe
 ┊5┊7┊];
```
[}]: #

Now it's testing time! Check that an invited user is able to reply to an
invitation, and also verify that the party's statistics update properly and reactively.
Login as an existing user. Add a new party, go to the party and
invite some other users. Then, open a new browser window in the anonymous mode along with the current window,
and login as the invited user there. Go to the party details page, and reply, say, "no";
the party's statistics on the first page with the parties list should duly update.

# Challenge

There is one important thing that we missed. Besides the party invitation
statistics, each user would like to know if she has already responded, in case she forgot,
to a particular invitation. This step's challenge will be to add this status
information onto the PartyDetails's view and make it update reactively.

> Hint: In order to make it reactive, you'll need to add one more handler into
> the party `MeteorObservable.autorun`, like the `getUsers` method in the this step above.

# Summary

We've just finished the invitation feature in this step, having added bunch of new stuff.
Socially is looking much more mature with Meteor Methods on board. We can give ourselves
a big thumbs-up for that!

Though, some places in the app can certainly be improved. For example,
we still show some private information to all invited users, which should be designated only for the party owner.
We'll fix this in the next step.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step14.md) | [Next Step >](step16.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #