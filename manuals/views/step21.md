[{]: <region> (header)
# Step 21: Handling Files with UploadFS
[}]: #
[{]: <region> (body)
In this step we are going to add the ability to upload images into our app, and also sorting and naming them.

Angular-Meteor can use Meteor [UploadFS](https://github.com/jalik/jalik-ufs) which is a suite of Meteor packages that together provide a complete file management solution including uploading, downloading, storage, synchronization, manipulation, and copying.

It supports several storage adapters for saving files to the local filesystem, GridFS and additional storage adapters can be created.

The process is very similar for handling any other MongoDB Collection!

So let's add image upload to our app!


We will start by adding UploadFS to our project, by running the following command:

    $ meteor add jalik:ufs

Now, we will decide the storage adapter we want to use.
In this example, we will use the GridFS as storage adapters, so we will add the adapter by running this command:

    $ meteor add jalik:ufs-gridfs

Note: you can find more information about Stores and Storage Adapters on the [UploadFS](https://github.com/jalik/jalik-ufs)'s GitHub repository.

So now we have the UploadFS support and the storage adapter installed - we still need to create a UploadFS object to handle our files.
Note that you will need to define the collection as shared resource because you will need to use the collection in both client and server side.

### Creating the Mongo Collection and UploadFS Store

Let's start by creating `both/collections/images.collection.ts` file, and define a Mongo Collection object called "Images". Since we want to be able to make thumbnails we have to create another Collection called "Thumbs".

Also we will use the stadard Mongo Collection API that allows us to defined auth-rules.

[{]: <helper> (diff_step 21.2)
#### Step 21.2: Create Images and Thumbs collections

##### Added both/collections/images.collection.ts
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊import { MongoObservable } from 'meteor-rxjs';
+┊ ┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊
+┊ ┊4┊export const Images = new MongoObservable.Collection('images');
+┊ ┊5┊export const Thumbs = new MongoObservable.Collection('thumbs');
```
[}]: #

Let's now create interfaces for both collections:

[{]: <helper> (diff_step 21.3)
#### Step 21.3: Define Image interface

##### Added both/models/image.model.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊export interface Image {
+┊  ┊ 2┊  _id?: string;
+┊  ┊ 3┊  complete: boolean;
+┊  ┊ 4┊  extension: string;
+┊  ┊ 5┊  name: string;
+┊  ┊ 6┊  progress: number;
+┊  ┊ 7┊  size: number;
+┊  ┊ 8┊  store: string;
+┊  ┊ 9┊  token: string;
+┊  ┊10┊  type: string;
+┊  ┊11┊  uploadedAt: Date;
+┊  ┊12┊  uploading: boolean;
+┊  ┊13┊  url: string;
+┊  ┊14┊  userId?: string;
+┊  ┊15┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 21.4)
#### Step 21.4: Define Thumbs interface

##### Changed both/models/image.model.ts
```diff
@@ -12,4 +12,9 @@
 ┊12┊12┊  uploading: boolean;
 ┊13┊13┊  url: string;
 ┊14┊14┊  userId?: string;
+┊  ┊15┊}
+┊  ┊16┊
+┊  ┊17┊export interface Thumb extends Image  {
+┊  ┊18┊  originalStore?: string;
+┊  ┊19┊  originalId?: string;
 ┊15┊20┊}🚫↵
```
[}]: #

And use them on Images and Thumbs collections:

[{]: <helper> (diff_step 21.5)
#### Step 21.5: Add interfaces to Mongo Collections

##### Changed both/collections/images.collection.ts
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import { MongoObservable } from 'meteor-rxjs';
 ┊2┊2┊import { Meteor } from 'meteor/meteor';
+┊ ┊3┊import { Thumb, Image } from "../models/image.model";
 ┊3┊4┊
-┊4┊ ┊export const Images = new MongoObservable.Collection('images');
-┊5┊ ┊export const Thumbs = new MongoObservable.Collection('thumbs');
+┊ ┊5┊export const Images = new MongoObservable.Collection<Image>('images');
+┊ ┊6┊export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');
```
[}]: #

We have to create Stores for Images and Thumbs.

[{]: <helper> (diff_step 21.6)
#### Step 21.6: Create stores for Images and Thumbs

##### Changed both/collections/images.collection.ts
```diff
@@ -1,6 +1,38 @@
 ┊ 1┊ 1┊import { MongoObservable } from 'meteor-rxjs';
 ┊ 2┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { UploadFS } from 'meteor/jalik:ufs';
 ┊ 3┊ 4┊import { Thumb, Image } from "../models/image.model";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const Images = new MongoObservable.Collection<Image>('images');
 ┊ 6┊ 7┊export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');
+┊  ┊ 8┊
+┊  ┊ 9┊function loggedIn(userId) {
+┊  ┊10┊  return !!userId;
+┊  ┊11┊}
+┊  ┊12┊
+┊  ┊13┊export const ThumbsStore = new UploadFS.store.GridFS({
+┊  ┊14┊  collection: Thumbs.collection,
+┊  ┊15┊  name: 'thumbs',
+┊  ┊16┊  permissions: new UploadFS.StorePermissions({
+┊  ┊17┊    insert: loggedIn,
+┊  ┊18┊    update: loggedIn,
+┊  ┊19┊    remove: loggedIn
+┊  ┊20┊  })
+┊  ┊21┊});
+┊  ┊22┊
+┊  ┊23┊export const ImagesStore = new UploadFS.store.GridFS({
+┊  ┊24┊  collection: Images.collection,
+┊  ┊25┊  name: 'images',
+┊  ┊26┊  filter: new UploadFS.Filter({
+┊  ┊27┊    contentTypes: ['image/*']
+┊  ┊28┊  }),
+┊  ┊29┊  copyTo: [
+┊  ┊30┊    ThumbsStore
+┊  ┊31┊  ],
+┊  ┊32┊  permissions: new UploadFS.StorePermissions({
+┊  ┊33┊    insert: loggedIn,
+┊  ┊34┊    update: loggedIn,
+┊  ┊35┊    remove: loggedIn
+┊  ┊36┊  })
+┊  ┊37┊});
+┊  ┊38┊
```
[}]: #

Let's explain a bit what happened.

* We assigned Stores to their Collections, which is required.
* We defined names of these Stores.
* We added filter to ImagesStore so it can receive only images.
* Every file will be copied to ThumbsStore.

There is a reason why we called one of the Collections the `Thumbs`!

Since we transfer every uploaded file to ThumbsStore, we can now easily add file manipulations.

Let's resize every file to 32x32:

[{]: <helper> (diff_step 21.7)
#### Step 21.7: Resize images

##### Changed both/collections/images.collection.ts
```diff
@@ -17,7 +17,19 @@
 ┊17┊17┊    insert: loggedIn,
 ┊18┊18┊    update: loggedIn,
 ┊19┊19┊    remove: loggedIn
-┊20┊  ┊  })
+┊  ┊20┊  }),
+┊  ┊21┊  transformWrite(from, to, fileId, file) {
+┊  ┊22┊    // Resize to 32x32
+┊  ┊23┊    const gm = require('gm');
+┊  ┊24┊
+┊  ┊25┊    gm(from, file.name)
+┊  ┊26┊      .resize(32, 32)
+┊  ┊27┊      .gravity('Center')
+┊  ┊28┊      .extent(32, 32)
+┊  ┊29┊      .quality(75)
+┊  ┊30┊      .stream()
+┊  ┊31┊      .pipe(to);
+┊  ┊32┊  }
 ┊21┊33┊});
 ┊22┊34┊
 ┊23┊35┊export const ImagesStore = new UploadFS.store.GridFS({
```
[}]: #

We used [`gm`](https://github.com/aheckmann/gm) module, let's install it:

    $ meteor npm install gm --save

> Note: To use this module, you need download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can use [Homebrew](http://brew.sh/) and do: `brew install graphicsmagick` or `brew install imagemagick`.

Now because we used `require`, which is a NodeJS API, we need to add a TypeScript declaration, so let's install it:

    $ meteor npm install @types/node --save
    
And let's import it in `typings.d.ts` file:    

[{]: <helper> (diff_step 21.9)
#### Step 21.9: Import NodeJS @types

##### Changed typings.d.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊/// <reference types="zone.js" />
 ┊2┊2┊/// <reference types="meteor-typings" />
 ┊3┊3┊/// <reference types="@types/underscore" />
+┊ ┊4┊/// <reference types="@types/node" />
 ┊4┊5┊
 ┊5┊6┊declare module '*.html' {
 ┊6┊7┊  const template: string;
```
[}]: #

### Image upload

Note that for file upload you can use basic HTML `<input type="file">` or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use Angular2 directive that handles file upload and gives us more abilities such as drag & drop, on the client side. In this example, We used [`angular2-file-drop`](https://github.com/jellyjs/angular2-file-drop), which is still in develop. In order to do this, let's add the package to our project:

    $ meteor npm install angular2-file-drop --save

And let's add it's module to ours:

[{]: <helper> (diff_step 21.12)
#### Step 21.12: Include file drop module

##### Changed client/imports/app/app.module.ts
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊import { SHARED_DECLARATIONS } from './shared';
 ┊13┊13┊import { MaterialModule } from "@angular/material";
 ┊14┊14┊import { AUTH_DECLARATIONS } from "./auth/index";
+┊  ┊15┊import { FileDropModule } from "angular2-file-drop";
 ┊15┊16┊
 ┊16┊17┊@NgModule({
 ┊17┊18┊  imports: [
```
```diff
@@ -24,7 +25,8 @@
 ┊24┊25┊    AgmCoreModule.forRoot({
 ┊25┊26┊      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
 ┊26┊27┊    }),
-┊27┊  ┊    MaterialModule.forRoot()
+┊  ┊28┊    MaterialModule.forRoot(),
+┊  ┊29┊    FileDropModule
 ┊28┊30┊  ],
 ┊29┊31┊  declarations: [
 ┊30┊32┊    AppComponent,
```
[}]: #

Now, let's create the `PartiesUpload` component. It will be responsible for uploading photos, starting with a stub of the view:

[{]: <helper> (diff_step 21.13)
#### Step 21.13: Create a view for an upload

##### Added client/imports/app/parties/parties-upload.component.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<div class="parties-update-container">
+┊ ┊2┊  <div>
+┊ ┊3┊    <div>Drop an image to here</div>
+┊ ┊4┊  </div>
+┊ ┊5┊</div>🚫↵
```
[}]: #

And the `Component`:

[{]: <helper> (diff_step 21.14)
#### Step 21.14: Create a PartiesUpload component

##### Added client/imports/app/parties/parties-upload.component.ts
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊import { Component } from '@angular/core';
+┊  ┊ 2┊
+┊  ┊ 3┊import template from './parties-upload.component.html';
+┊  ┊ 4┊
+┊  ┊ 5┊@Component({
+┊  ┊ 6┊  selector: 'parties-upload',
+┊  ┊ 7┊  template
+┊  ┊ 8┊})
+┊  ┊ 9┊export class PartiesUploadComponent {
+┊  ┊10┊  constructor() {}
+┊  ┊11┊}🚫↵
```
[}]: #

And let's add it to our declarations file:

[{]: <helper> (diff_step 21.15)
#### Step 21.15: Added PartiesUpload component to the index file

##### Changed client/imports/app/parties/index.ts
```diff
@@ -1,9 +1,11 @@
 ┊ 1┊ 1┊import { PartiesFormComponent } from './parties-form.component';
 ┊ 2┊ 2┊import { PartiesListComponent } from './parties-list.component';
 ┊ 3┊ 3┊import { PartyDetailsComponent } from './party-details.component';
+┊  ┊ 4┊import {PartiesUploadComponent} from "./parties-upload.component";
 ┊ 4┊ 5┊
 ┊ 5┊ 6┊export const PARTIES_DECLARATIONS = [
 ┊ 6┊ 7┊  PartiesFormComponent,
 ┊ 7┊ 8┊  PartiesListComponent,
-┊ 8┊  ┊  PartyDetailsComponent
+┊  ┊ 9┊  PartyDetailsComponent,
+┊  ┊10┊  PartiesUploadComponent
 ┊ 9┊11┊];
```
[}]: #

We want to use it in `PartiesForm`:

[{]: <helper> (diff_step 21.16)
#### Step 21.16: Use PartiesUploadComponent inside the form

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -17,6 +17,7 @@
 ┊17┊17┊              <br/>
 ┊18┊18┊              <md-checkbox formControlName="public">Public party?</md-checkbox>
 ┊19┊19┊              <br/><br/>
+┊  ┊20┊              <parties-upload #upload></parties-upload>
 ┊20┊21┊              <button color="accent" md-raised-button type="submit">Add my party!</button>
 ┊21┊22┊            </div>
 ┊22┊23┊            <div class="form-extras">
```
[}]: #

Now, let's implement `fileDrop` directive:

[{]: <helper> (diff_step 21.17)
#### Step 21.17: Add bindings to FileDrop

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -1,5 +1,8 @@
 ┊1┊1┊<div class="parties-update-container">
-┊2┊ ┊  <div>
+┊ ┊2┊  <div fileDrop
+┊ ┊3┊       [ngClass]="{'file-is-over': fileIsOver}"
+┊ ┊4┊       (fileOver)="fileOver($event)"
+┊ ┊5┊       (onFileDrop)="onFileDrop($event)">
 ┊3┊6┊    <div>Drop an image to here</div>
 ┊4┊7┊  </div>
 ┊5┊8┊</div>🚫↵
```
[}]: #

As you can see we used `fileOver` event. It tells the component if file is over the drop zone.

We can now handle it inside the component:

[{]: <helper> (diff_step 21.18)
#### Step 21.18: Handle fileIsOver

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -7,5 +7,11 @@
 ┊ 7┊ 7┊  template
 ┊ 8┊ 8┊})
 ┊ 9┊ 9┊export class PartiesUploadComponent {
+┊  ┊10┊  fileIsOver: boolean = false;
+┊  ┊11┊
 ┊10┊12┊  constructor() {}
+┊  ┊13┊
+┊  ┊14┊  fileOver(fileIsOver: boolean): void {
+┊  ┊15┊    this.fileIsOver = fileIsOver;
+┊  ┊16┊  }
 ┊11┊17┊}🚫↵
```
[}]: #

Second thing is to handle `onFileDrop` event:

[{]: <helper> (diff_step 21.19)
#### Step 21.19: Implement onFileDrop method

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -14,4 +14,8 @@
 ┊14┊14┊  fileOver(fileIsOver: boolean): void {
 ┊15┊15┊    this.fileIsOver = fileIsOver;
 ┊16┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  onFileDrop(file: File): void {
+┊  ┊19┊    console.log('Got file');
+┊  ┊20┊  }
 ┊17┊21┊}🚫↵
```
[}]: #

Now our component is able to catch any dropped file, so let's create a function to upload that file into server.

[{]: <helper> (diff_step 21.20)
#### Step 21.20: Implement the upload method

##### Added both/methods/images.methods.ts
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import { UploadFS } from 'meteor/jalik:ufs';
+┊  ┊ 2┊import { ImagesStore } from '../collections/images.collection';
+┊  ┊ 3┊
+┊  ┊ 4┊export function upload(data: File): Promise<any> {
+┊  ┊ 5┊  return new Promise((resolve, reject) => {
+┊  ┊ 6┊    // pick from an object only: name, type and size
+┊  ┊ 7┊    const file = {
+┊  ┊ 8┊      name: data.name,
+┊  ┊ 9┊      type: data.type,
+┊  ┊10┊      size: data.size,
+┊  ┊11┊    };
+┊  ┊12┊
+┊  ┊13┊    const upload = new UploadFS.Uploader({
+┊  ┊14┊      data,
+┊  ┊15┊      file,
+┊  ┊16┊      store: ImagesStore,
+┊  ┊17┊      onError: reject,
+┊  ┊18┊      onComplete: resolve
+┊  ┊19┊    });
+┊  ┊20┊
+┊  ┊21┊    upload.start();
+┊  ┊22┊  });
+┊  ┊23┊}🚫↵
```
[}]: #

Quick explanation. We need to know the name, the type and also the size of file we want to upload. We can get it from `data` object.

Now we can move on to use that function in `PartiesUpload` component:

[{]: <helper> (diff_step 21.21)
#### Step 21.21: Use the upload function

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -2,12 +2,15 @@
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
+┊  ┊ 5┊import { upload } from '../../../../both/methods/images.methods';
+┊  ┊ 6┊
 ┊ 5┊ 7┊@Component({
 ┊ 6┊ 8┊  selector: 'parties-upload',
 ┊ 7┊ 9┊  template
 ┊ 8┊10┊})
 ┊ 9┊11┊export class PartiesUploadComponent {
 ┊10┊12┊  fileIsOver: boolean = false;
+┊  ┊13┊  uploading: boolean = false;
 ┊11┊14┊
 ┊12┊15┊  constructor() {}
 ┊13┊16┊
```
```diff
@@ -16,6 +19,15 @@
 ┊16┊19┊  }
 ┊17┊20┊
 ┊18┊21┊  onFileDrop(file: File): void {
-┊19┊  ┊    console.log('Got file');
+┊  ┊22┊    this.uploading = true;
+┊  ┊23┊
+┊  ┊24┊    upload(file)
+┊  ┊25┊      .then(() => {
+┊  ┊26┊        this.uploading = false;
+┊  ┊27┊      })
+┊  ┊28┊      .catch((error) => {
+┊  ┊29┊        this.uploading = false;
+┊  ┊30┊        console.log(`Something went wrong!`, error);
+┊  ┊31┊      });
 ┊20┊32┊  }
 ┊21┊33┊}🚫↵
```
[}]: #

Now let's take a little break and solve those annoying missing modules errors. Since the uploading packages we used in the `upload` method are package that comes from Meteor Atmosphere and they not provide TypeScript declaration (`.d.ts` files), we need to create one for them.

Let's add it:

[{]: <helper> (diff_step 21.22)
#### Step 21.22: Declare meteor/jalik:ufs module

##### Added typings/jalik-ufs.d.ts
```diff
@@ -0,0 +1,11 @@
+┊  ┊ 1┊declare module "meteor/jalik:ufs" {
+┊  ┊ 2┊  interface Uploader {
+┊  ┊ 3┊    start: () => void;
+┊  ┊ 4┊  }
+┊  ┊ 5┊
+┊  ┊ 6┊  interface UploadFS {
+┊  ┊ 7┊    Uploader: (options: any) => Uploader;
+┊  ┊ 8┊  }
+┊  ┊ 9┊
+┊  ┊10┊  export var UploadFS;
+┊  ┊11┊}🚫↵
```
[}]: #

Let's also add the `file-uploading` css class:

[{]: <helper> (diff_step 21.23)
#### Step 21.23: Implement classes

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -1,6 +1,6 @@
 ┊1┊1┊<div class="parties-update-container">
 ┊2┊2┊  <div fileDrop
-┊3┊ ┊       [ngClass]="{'file-is-over': fileIsOver}"
+┊ ┊3┊       [ngClass]="{'file-is-over': fileIsOver, 'file-uploading': uploading}"
 ┊4┊4┊       (fileOver)="fileOver($event)"
 ┊5┊5┊       (onFileDrop)="onFileDrop($event)">
 ┊6┊6┊    <div>Drop an image to here</div>
```
[}]: #

### Display Uploaded Images

Let's create a simple gallery to list the images in the new party form.

First thing to do is to create a Publication for thumbnails:

[{]: <helper> (diff_step 21.24)
#### Step 21.24: Implement publications of Images and Thumbs

##### Added server/imports/publications/images.ts
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Thumbs, Images } from '../../../both/collections/images.collection';
+┊  ┊ 3┊
+┊  ┊ 4┊Meteor.publish('thumbs', function(ids: string[]) {
+┊  ┊ 5┊  return Thumbs.collection.find({
+┊  ┊ 6┊    originalStore: 'images',
+┊  ┊ 7┊    originalId: {
+┊  ┊ 8┊      $in: ids
+┊  ┊ 9┊    }
+┊  ┊10┊  });
+┊  ┊11┊});
+┊  ┊12┊
+┊  ┊13┊Meteor.publish('images', function() {
+┊  ┊14┊  return Images.collection.find({});
+┊  ┊15┊});🚫↵
```
[}]: #

As you can see we also created a Publication for images. We will use it later.

We still need to add it on the server-side:

[{]: <helper> (diff_step 21.25)
#### Step 21.25: Import those publications in the server entry point

##### Changed server/main.ts
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import './imports/publications/parties';
 ┊ 6┊ 6┊import './imports/publications/users';
 ┊ 7┊ 7┊import '../both/methods/parties.methods';
+┊  ┊ 8┊import './imports/publications/images';
 ┊ 8┊ 9┊
 ┊ 9┊10┊Meteor.startup(() => {
 ┊10┊11┊  loadParties();
```
[}]: #

Now let's take care of UI. This will need to be reactive, so we will use again the `MeteorObservable` wrapper and RxJS.

Let's create a `Subject` that will be in charge of notification regarding files actions:

[{]: <helper> (diff_step 21.26)
#### Step 21.26: Use RxJS to keep track of files

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,9 +1,11 @@
-┊ 1┊  ┊import { Component } from '@angular/core';
+┊  ┊ 1┊import {Component} from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 8┊
 ┊ 7┊ 9┊@Component({
 ┊ 8┊10┊  selector: 'parties-upload',
 ┊ 9┊11┊  template
```
```diff
@@ -11,6 +13,7 @@
 ┊11┊13┊export class PartiesUploadComponent {
 ┊12┊14┊  fileIsOver: boolean = false;
 ┊13┊15┊  uploading: boolean = false;
+┊  ┊16┊  files: Subject<string[]> = new Subject<string[]>();
 ┊14┊17┊
 ┊15┊18┊  constructor() {}
```
[}]: #

Let's now subscribe to `thumbs` publication with an array of those ids we created in the previous step:

[{]: <helper> (diff_step 21.27)
#### Step 21.27: Subscribe to the thumbs publication

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,22 +1,36 @@
-┊ 1┊  ┊import {Component} from '@angular/core';
+┊  ┊ 1┊import {Component, OnInit} from '@angular/core';
 ┊ 2┊ 2┊
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
-┊ 6┊  ┊
 ┊ 7┊ 6┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 7┊import {MeteorObservable} from "meteor-rxjs";
 ┊ 8┊ 8┊
 ┊ 9┊ 9┊@Component({
 ┊10┊10┊  selector: 'parties-upload',
 ┊11┊11┊  template
 ┊12┊12┊})
-┊13┊  ┊export class PartiesUploadComponent {
+┊  ┊13┊export class PartiesUploadComponent implements OnInit {
 ┊14┊14┊  fileIsOver: boolean = false;
 ┊15┊15┊  uploading: boolean = false;
 ┊16┊16┊  files: Subject<string[]> = new Subject<string[]>();
+┊  ┊17┊  thumbsSubscription: Subscription;
 ┊17┊18┊
 ┊18┊19┊  constructor() {}
 ┊19┊20┊
+┊  ┊21┊  ngOnInit() {
+┊  ┊22┊    this.files.subscribe((filesArray) => {
+┊  ┊23┊      MeteorObservable.autorun().subscribe(() => {
+┊  ┊24┊        if (this.thumbsSubscription) {
+┊  ┊25┊          this.thumbsSubscription.unsubscribe();
+┊  ┊26┊          this.thumbsSubscription = undefined;
+┊  ┊27┊        }
+┊  ┊28┊
+┊  ┊29┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe();
+┊  ┊30┊      });
+┊  ┊31┊    });
+┊  ┊32┊  }
+┊  ┊33┊
 ┊20┊34┊  fileOver(fileIsOver: boolean): void {
 ┊21┊35┊    this.fileIsOver = fileIsOver;
 ┊22┊36┊  }
```
[}]: #

Now we can look for thumbnails that come from `ImagesStore`:

[{]: <helper> (diff_step 21.28)
#### Step 21.28: Look for the thumbnails

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -3,8 +3,10 @@
 ┊ 3┊ 3┊import template from './parties-upload.component.html';
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊import { upload } from '../../../../both/methods/images.methods';
-┊ 6┊  ┊import {Subject, Subscription} from "rxjs";
+┊  ┊ 6┊import {Subject, Subscription, Observable} from "rxjs";
 ┊ 7┊ 7┊import {MeteorObservable} from "meteor-rxjs";
+┊  ┊ 8┊import {Thumb} from "../../../../both/models/image.model";
+┊  ┊ 9┊import {Thumbs} from "../../../../both/collections/images.collection";
 ┊ 8┊10┊
 ┊ 9┊11┊@Component({
 ┊10┊12┊  selector: 'parties-upload',
```
```diff
@@ -15,6 +17,7 @@
 ┊15┊17┊  uploading: boolean = false;
 ┊16┊18┊  files: Subject<string[]> = new Subject<string[]>();
 ┊17┊19┊  thumbsSubscription: Subscription;
+┊  ┊20┊  thumbs: Observable<Thumb[]>;
 ┊18┊21┊
 ┊19┊22┊  constructor() {}
 ┊20┊23┊
```
```diff
@@ -26,7 +29,14 @@
 ┊26┊29┊          this.thumbsSubscription = undefined;
 ┊27┊30┊        }
 ┊28┊31┊
-┊29┊  ┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe();
+┊  ┊32┊        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe(() => {
+┊  ┊33┊          this.thumbs = Thumbs.find({
+┊  ┊34┊            originalStore: 'images',
+┊  ┊35┊            originalId: {
+┊  ┊36┊              $in: filesArray
+┊  ┊37┊            }
+┊  ┊38┊          }).zone();
+┊  ┊39┊        });
 ┊30┊40┊      });
 ┊31┊41┊    });
 ┊32┊42┊  }
```
[}]: #

We still don't see any thumbnails, so let's add a view for the thumbs:

[{]: <helper> (diff_step 21.29)
#### Step 21.29: Implement the thumbnails in the view

##### Changed client/imports/app/parties/parties-upload.component.html
```diff
@@ -5,4 +5,10 @@
 ┊ 5┊ 5┊       (onFileDrop)="onFileDrop($event)">
 ┊ 6┊ 6┊    <div>Drop an image to here</div>
 ┊ 7┊ 7┊  </div>
+┊  ┊ 8┊  <div *ngIf="thumbs" class="thumbs">
+┊  ┊ 9┊    <div *ngFor="let thumb of thumbs | async" class="thumb">
+┊  ┊10┊      <img [src]="thumb.url"/>
+┊  ┊11┊    </div>
+┊  ┊12┊    <div class="clear"></div>
+┊  ┊13┊  </div>
 ┊ 8┊14┊</div>🚫↵
```
[}]: #

Since we are working on a view right now, let's add some style.

We need to create `parties-upload.component.scss` file:

[{]: <helper> (diff_step 21.30)
#### Step 21.30: Basic styles

##### Added client/imports/app/parties/parties-upload.component.scss
```diff
@@ -0,0 +1,46 @@
+┊  ┊ 1┊.file-uploading {
+┊  ┊ 2┊  opacity: 0.3;
+┊  ┊ 3┊}
+┊  ┊ 4┊
+┊  ┊ 5┊.file-is-over {
+┊  ┊ 6┊  opacity: 0.7;
+┊  ┊ 7┊}
+┊  ┊ 8┊
+┊  ┊ 9┊.parties-update-container {
+┊  ┊10┊  width: 90%;
+┊  ┊11┊  margin: 15px;
+┊  ┊12┊
+┊  ┊13┊  .thumbs {
+┊  ┊14┊    margin-top: 10px;
+┊  ┊15┊    margin-bottom: 10px;
+┊  ┊16┊
+┊  ┊17┊    .clear {
+┊  ┊18┊      clear: both;
+┊  ┊19┊    }
+┊  ┊20┊
+┊  ┊21┊    .thumb {
+┊  ┊22┊      float: left;
+┊  ┊23┊      width: 60px;
+┊  ┊24┊      height: 60px;
+┊  ┊25┊      display: flex;
+┊  ┊26┊      justify-content: center;
+┊  ┊27┊      align-items: center;
+┊  ┊28┊      overflow: hidden;
+┊  ┊29┊      margin-right: 5px;
+┊  ┊30┊
+┊  ┊31┊      img {
+┊  ┊32┊        flex-shrink: 0;
+┊  ┊33┊        min-width: 100%;
+┊  ┊34┊        min-height: 100%
+┊  ┊35┊      }
+┊  ┊36┊    }
+┊  ┊37┊  }
+┊  ┊38┊}
+┊  ┊39┊
+┊  ┊40┊[filedrop] {
+┊  ┊41┊  width: 100%;
+┊  ┊42┊  height: 60px;
+┊  ┊43┊  line-height: 60px;
+┊  ┊44┊  text-align: center;
+┊  ┊45┊  border: 3px dashed rgba(255, 255, 255, 0.7);
+┊  ┊46┊}🚫↵
```
[}]: #

And let's import the SCSS file into our Component:

[{]: <helper> (diff_step 21.31)
#### Step 21.31: Added import for the styles file

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,6 +1,7 @@
 ┊1┊1┊import {Component, OnInit} from '@angular/core';
 ┊2┊2┊
 ┊3┊3┊import template from './parties-upload.component.html';
+┊ ┊4┊import style from './parties-upload.component.scss';
 ┊4┊5┊
 ┊5┊6┊import { upload } from '../../../../both/methods/images.methods';
 ┊6┊7┊import {Subject, Subscription, Observable} from "rxjs";
```
```diff
@@ -10,7 +11,8 @@
 ┊10┊11┊
 ┊11┊12┊@Component({
 ┊12┊13┊  selector: 'parties-upload',
-┊13┊  ┊  template
+┊  ┊14┊  template,
+┊  ┊15┊  styles: [ style ]
 ┊14┊16┊})
 ┊15┊17┊export class PartiesUploadComponent implements OnInit {
 ┊16┊18┊  fileIsOver: boolean = false;
```
[}]: #

Great! We can move on to the next step. Let's do something with the result of the `upload` function.

We will create the `addFile` method that updates the `files` property, and we will add the actual array the in charge of the notifications in `files` (which is a `Subject` and only in charge of the notifications, not the actual data):

[{]: <helper> (diff_step 21.32)
#### Step 21.32: Handle file upload

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -17,6 +17,7 @@
 ┊17┊17┊export class PartiesUploadComponent implements OnInit {
 ┊18┊18┊  fileIsOver: boolean = false;
 ┊19┊19┊  uploading: boolean = false;
+┊  ┊20┊  filesArray: string[] = [];
 ┊20┊21┊  files: Subject<string[]> = new Subject<string[]>();
 ┊21┊22┊  thumbsSubscription: Subscription;
 ┊22┊23┊  thumbs: Observable<Thumb[]>;
```
```diff
@@ -51,12 +52,18 @@
 ┊51┊52┊    this.uploading = true;
 ┊52┊53┊
 ┊53┊54┊    upload(file)
-┊54┊  ┊      .then(() => {
+┊  ┊55┊      .then((result) => {
 ┊55┊56┊        this.uploading = false;
+┊  ┊57┊        this.addFile(result);
 ┊56┊58┊      })
 ┊57┊59┊      .catch((error) => {
 ┊58┊60┊        this.uploading = false;
 ┊59┊61┊        console.log(`Something went wrong!`, error);
 ┊60┊62┊      });
 ┊61┊63┊  }
+┊  ┊64┊
+┊  ┊65┊  addFile(file) {
+┊  ┊66┊    this.filesArray.push(file._id);
+┊  ┊67┊    this.files.next(this.filesArray);
+┊  ┊68┊  }
 ┊62┊69┊}🚫↵
```
[}]: #

We want a communication between PartiesUpload and PartiesForm. Let's use `Output` decorator and the `EventEmitter` to notify PartiesForm component about every new file.

[{]: <helper> (diff_step 21.33)
#### Step 21.33: Emit event with the new file

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import {Component, OnInit} from '@angular/core';
+┊ ┊1┊import {Component, OnInit, EventEmitter, Output} from '@angular/core';
 ┊2┊2┊
 ┊3┊3┊import template from './parties-upload.component.html';
 ┊4┊4┊import style from './parties-upload.component.scss';
```
```diff
@@ -21,6 +21,7 @@
 ┊21┊21┊  files: Subject<string[]> = new Subject<string[]>();
 ┊22┊22┊  thumbsSubscription: Subscription;
 ┊23┊23┊  thumbs: Observable<Thumb[]>;
+┊  ┊24┊  @Output() onFile: EventEmitter<string> = new EventEmitter<string>();
 ┊24┊25┊
 ┊25┊26┊  constructor() {}
 ┊26┊27┊
```
```diff
@@ -65,5 +66,6 @@
 ┊65┊66┊  addFile(file) {
 ┊66┊67┊    this.filesArray.push(file._id);
 ┊67┊68┊    this.files.next(this.filesArray);
+┊  ┊69┊    this.onFile.emit(file._id);
 ┊68┊70┊  }
 ┊69┊71┊}🚫↵
```
[}]: #

On the receiving side of this connection we have the PartiesForm component.

Create a method that handles an event with the new file and put images inside the FormBuilder.

[{]: <helper> (diff_step 21.34)
#### Step 21.34: Add images to the PartiesForm component

##### Changed client/imports/app/parties/parties-form.component.ts
```diff
@@ -14,6 +14,7 @@
 ┊14┊14┊export class PartiesFormComponent implements OnInit {
 ┊15┊15┊  addForm: FormGroup;
 ┊16┊16┊  newPartyPosition: {lat:number, lng: number} = {lat: 37.4292, lng: -122.1381};
+┊  ┊17┊  images: string[] = [];
 ┊17┊18┊
 ┊18┊19┊  constructor(
 ┊19┊20┊    private formBuilder: FormBuilder
```
```diff
@@ -47,6 +48,7 @@
 ┊47┊48┊          lat: this.newPartyPosition.lat,
 ┊48┊49┊          lng: this.newPartyPosition.lng
 ┊49┊50┊        },
+┊  ┊51┊        images: this.images,
 ┊50┊52┊        public: this.addForm.value.public,
 ┊51┊53┊        owner: Meteor.userId()
 ┊52┊54┊      });
```
```diff
@@ -54,4 +56,8 @@
 ┊54┊56┊      this.addForm.reset();
 ┊55┊57┊    }
 ┊56┊58┊  }
+┊  ┊59┊
+┊  ┊60┊  onImage(imageId: string) {
+┊  ┊61┊    this.images.push(imageId);
+┊  ┊62┊  }
 ┊57┊63┊}
```
[}]: #

To keep Party interface up to date, we need to add `images` to it:

[{]: <helper> (diff_step 21.35)
#### Step 21.35: Add images property to the Party interface

##### Changed both/models/party.model.ts
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊  public: boolean;
 ┊ 9┊ 9┊  invited?: string[];
 ┊10┊10┊  rsvps?: RSVP[];
+┊  ┊11┊  images?: string[];
 ┊11┊12┊}
 ┊12┊13┊
 ┊13┊14┊interface RSVP {
```
[}]: #

The last step will be to create an event binding for `onFile`.

[{]: <helper> (diff_step 21.36)
#### Step 21.36: Bind the onFile event

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -17,7 +17,7 @@
 ┊17┊17┊              <br/>
 ┊18┊18┊              <md-checkbox formControlName="public">Public party?</md-checkbox>
 ┊19┊19┊              <br/><br/>
-┊20┊  ┊              <parties-upload #upload></parties-upload>
+┊  ┊20┊              <parties-upload #upload (onFile)="onImage($event)"></parties-upload>
 ┊21┊21┊              <button color="accent" md-raised-button type="submit">Add my party!</button>
 ┊22┊22┊            </div>
 ┊23┊23┊            <div class="form-extras">
```
[}]: #

### Display the main image of each party on the list

We will use Pipes to achieve this.

Let's create the `DisplayMainImagePipe` inside `client/imports/app/shared/display-main-image.pipe.ts`:

[{]: <helper> (diff_step 21.37)
#### Step 21.37: Create DisplayMainImage pipe

##### Added client/imports/app/shared/display-main-image.pipe.ts
```diff
@@ -0,0 +1,25 @@
+┊  ┊ 1┊import {Pipe, PipeTransform} from '@angular/core';
+┊  ┊ 2┊import { Images } from '../../../../both/collections/images.collection';
+┊  ┊ 3┊import { Party } from '../../../../both/models/party.model';
+┊  ┊ 4┊
+┊  ┊ 5┊@Pipe({
+┊  ┊ 6┊  name: 'displayMainImage'
+┊  ┊ 7┊})
+┊  ┊ 8┊export class DisplayMainImagePipe implements PipeTransform {
+┊  ┊ 9┊  transform(party: Party) {
+┊  ┊10┊    if (!party) {
+┊  ┊11┊      return;
+┊  ┊12┊    }
+┊  ┊13┊
+┊  ┊14┊    let imageUrl: string;
+┊  ┊15┊    let imageId: string = (party.images || [])[0];
+┊  ┊16┊
+┊  ┊17┊    const found = Images.findOne(imageId);
+┊  ┊18┊
+┊  ┊19┊    if (found) {
+┊  ┊20┊      imageUrl = found.url;
+┊  ┊21┊    }
+┊  ┊22┊
+┊  ┊23┊    return imageUrl;
+┊  ┊24┊  }
+┊  ┊25┊}🚫↵
```
[}]: #

Since we have it done, let's add it to PartiesList:

[{]: <helper> (diff_step 21.38)
#### Step 21.38: Add DisplayMainImage pipe

##### Changed client/imports/app/shared/index.ts
```diff
@@ -1,7 +1,9 @@
 ┊1┊1┊import { DisplayNamePipe } from './display-name.pipe';
 ┊2┊2┊import {RsvpPipe} from "./rsvp.pipe";
+┊ ┊3┊import {DisplayMainImagePipe} from "./display-main-image.pipe";
 ┊3┊4┊
 ┊4┊5┊export const SHARED_DECLARATIONS: any[] = [
 ┊5┊6┊  DisplayNamePipe,
-┊6┊ ┊  RsvpPipe
+┊ ┊7┊  RsvpPipe,
+┊ ┊8┊  DisplayMainImagePipe
 ┊7┊9┊];
```
[}]: #

We also need to subscribe to `images`:

[{]: <helper> (diff_step 21.39)
#### Step 21.39: Subscribe to the images publication

##### Changed client/imports/app/parties/parties-list.component.ts
```diff
@@ -41,12 +41,15 @@
 ┊41┊41┊  autorunSub: Subscription;
 ┊42┊42┊  location: Subject<string> = new Subject<string>();
 ┊43┊43┊  user: Meteor.User;
+┊  ┊44┊  imagesSubs: Subscription;
 ┊44┊45┊
 ┊45┊46┊  constructor(
 ┊46┊47┊    private paginationService: PaginationService
 ┊47┊48┊  ) {}
 ┊48┊49┊
 ┊49┊50┊  ngOnInit() {
+┊  ┊51┊    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();
+┊  ┊52┊
 ┊50┊53┊    this.optionsSub = Observable.combineLatest(
 ┊51┊54┊      this.pageSize,
 ┊52┊55┊      this.curPage,
```
```diff
@@ -117,5 +120,6 @@
 ┊117┊120┊    this.partiesSub.unsubscribe();
 ┊118┊121┊    this.optionsSub.unsubscribe();
 ┊119┊122┊    this.autorunSub.unsubscribe();
+┊   ┊123┊    this.imagesSubs.unsubscribe();
 ┊120┊124┊  }
 ┊121┊125┊}
```
[}]: #

We can now just implement it:

[{]: <helper> (diff_step 21.40)
#### Step 21.40: Implement the pipe

##### Changed client/imports/app/parties/parties-list.component.html
```diff
@@ -19,6 +19,7 @@
 ┊19┊19┊    <pagination-controls class="pagination" (pageChange)="onPageChanged($event)"></pagination-controls>
 ┊20┊20┊
 ┊21┊21┊    <md-card *ngFor="let party of parties | async" class="party-card">
+┊  ┊22┊      <img *ngIf="party.images && party.images.length > 0" class="party-main-image" [src]="party | displayMainImage">
 ┊22┊23┊      <h2 class="party-name">
 ┊23┊24┊        <a [routerLink]="['/party', party._id]">{{party.name}}</a>
 ┊24┊25┊      </h2>
```
[}]: #

Add some css rules to keep the control of images:

[{]: <helper> (diff_step 21.41)
#### Step 21.41: Add some styles

##### Changed client/imports/app/parties/parties-list.component.scss
```diff
@@ -24,6 +24,11 @@
 ┊24┊24┊      margin: 20px;
 ┊25┊25┊      position: relative;
 ┊26┊26┊
+┊  ┊27┊      img.party-main-image {
+┊  ┊28┊        max-width: 100%;
+┊  ┊29┊        max-height: 100%;
+┊  ┊30┊      }
+┊  ┊31┊
 ┊27┊32┊      .party-name > a {
 ┊28┊33┊        color: black;
 ┊29┊34┊        text-decoration: none;
```
[}]: #

We still need to add the reset functionality to the component, since we want to manage what happens after images were added:

[{]: <helper> (diff_step 21.42)
#### Step 21.42: Add the reset method to PartiesUpload component

##### Changed client/imports/app/parties/parties-upload.component.ts
```diff
@@ -68,4 +68,9 @@
 ┊68┊68┊    this.files.next(this.filesArray);
 ┊69┊69┊    this.onFile.emit(file._id);
 ┊70┊70┊  }
+┊  ┊71┊
+┊  ┊72┊  reset() {
+┊  ┊73┊    this.filesArray = [];
+┊  ┊74┊    this.files.next(this.filesArray);
+┊  ┊75┊  }
 ┊71┊76┊}🚫↵
```
[}]: #

By using `#upload` we get access to the PartiesUpload component's API. We can now use the `reset()`` method:

[{]: <helper> (diff_step 21.43)
#### Step 21.43: Reset files on ngSubmit

##### Changed client/imports/app/parties/parties-form.component.html
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊        <h2>Add it now! ></h2>
 ┊ 7┊ 7┊      </div>
 ┊ 8┊ 8┊      <div class="form-center">
-┊ 9┊  ┊        <form *ngIf="user" [formGroup]="addForm" (ngSubmit)="addParty()">
+┊  ┊ 9┊        <form *ngIf="user" [formGroup]="addForm" (ngSubmit)="addParty(); upload.reset();">
 ┊10┊10┊          <div style="display: table-row">
 ┊11┊11┊            <div class="form-inputs">
 ┊12┊12┊              <md-input dividerColor="accent" formControlName="name" placeholder="Party name"></md-input>
```
[}]: #

And that's it!

### Cloud Storage

By storing files in the cloud you can reduce your costs and get a lot of other benefits.

Since this chapter is all about uploading files and UploadFS doesn't have built-in support for cloud services we should mention another library for that.

We recommend you to use [Slingshot](https://github.com/CulturalMe/meteor-slingshot/). You can install it by running:

    $ meteor add edgee:slingshot

It's very easy to use with AWS S3, Google Cloud and other cloud storage services.

From slignshot's repository:

> meteor-slingshot uploads the files directly to the cloud service from the browser without ever exposing your secret access key or any other sensitive data to the client and without requiring public write access to cloud storage to the entire public.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step20.md) | [Next Step >](step22.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #