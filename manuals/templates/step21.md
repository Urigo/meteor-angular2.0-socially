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

{{{diff_step 21.2}}}

Let's now create interfaces for both collections:

{{{diff_step 21.3}}}

{{{diff_step 21.4}}}

And use them on Images and Thumbs collections:

{{{diff_step 21.5}}}

We have to create Stores for Images and Thumbs.

{{{diff_step 21.6}}}

Let's explain a bit what happened.

* We assigned Stores to their Collections, which is required.
* We defined names of these Stores.
* We added filter to ImagesStore so it can receive only images.
* Every file will be copied to ThumbsStore.

There is a reason why we called one of the Collections the `Thumbs`!

Since we transfer every uploaded file to ThumbsStore, we can now easily add file manipulations.

Let's resize every file to 32x32:

{{{diff_step 21.7}}}

We used [`gm`](https://github.com/aheckmann/gm) module, let's install it:

    $ meteor npm install gm --save

> Note: To use this module, you need download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can use [Homebrew](http://brew.sh/) and do: `brew install graphicsmagick` or `brew install imagemagick`.

Now because we used `require`, which is a NodeJS API, we need to add a TypeScript declaration, so let's install it:

    $ meteor npm install @types/node --save
    
And let's import it in `typings.d.ts` file:    

{{{diff_step 21.9}}}

### Image upload

Note that for file upload you can use basic HTML `<input type="file">` or any other package - you only need the HTML5 File object to be provided.

For our application, we would like to add ability to drag-and-drop images, so we use Angular2 directive that handles file upload and gives us more abilities such as drag & drop, on the client side. In this example, We used [`angular2-file-drop`](https://github.com/jellyjs/angular2-file-drop), which is still in develop. In order to do this, let's add the package to our project:

    $ meteor npm install angular2-file-drop --save

And let's add it's module to ours:

{{{diff_step 21.12}}}

Now, let's create the `PartiesUpload` component. It will be responsible for uploading photos, starting with a stub of the view:

{{{diff_step 21.13}}}

And the `Component`:

{{{diff_step 21.14}}}

And let's add it to our declarations file:

{{{diff_step 21.15}}}

We want to use it in `PartiesForm`:

{{{diff_step 21.16}}}

Now, let's implement `fileDrop` directive:

{{{diff_step 21.17}}}

As you can see we used `fileOver` event. It tells the component if file is over the drop zone.

We can now handle it inside the component:

{{{diff_step 21.18}}}

Second thing is to handle `onFileDrop` event:

{{{diff_step 21.19}}}

Now our component is able to catch any dropped file, so let's create a function to upload that file into server.

{{{diff_step 21.20}}}

Quick explanation. We need to know the name, the type and also the size of file we want to upload. We can get it from `data` object.

Now we can move on to use that function in `PartiesUpload` component:

{{{diff_step 21.21}}}

Now let's take a little break and solve those annoying missing modules errors. Since the uploading packages we used in the `upload` method are package that comes from Meteor Atmosphere and they not provide TypeScript declaration (`.d.ts` files), we need to create one for them.

Let's add it:

{{{diff_step 21.22}}}

Let's also add the `file-uploading` css class:

{{{diff_step 21.23}}}

### Display Uploaded Images

Let's create a simple gallery to list the images in the new party form.

First thing to do is to create a Publication for thumbnails:

{{{diff_step 21.24}}}

As you can see we also created a Publication for images. We will use it later.

We still need to add it on the server-side:

{{{diff_step 21.25}}}

Now let's take care of UI. This will need to be reactive, so we will use again the `MeteorObservable` wrapper and RxJS.

Let's create a `Subject` that will be in charge of notification regarding files actions:

{{{diff_step 21.26}}}

Let's now subscribe to `thumbs` publication with an array of those ids we created in the previous step:

{{{diff_step 21.27}}}

Now we can look for thumbnails that come from `ImagesStore`:

{{{diff_step 21.28}}}

We still don't see any thumbnails, so let's add a view for the thumbs:

{{{diff_step 21.29}}}

Since we are working on a view right now, let's add some style.

We need to create `parties-upload.component.scss` file:

{{{diff_step 21.30}}}

And let's import the SCSS file into our Component:

{{{diff_step 21.31}}}

Great! We can move on to the next step. Let's do something with the result of the `upload` function.

We will create the `addFile` method that updates the `files` property, and we will add the actual array the in charge of the notifications in `files` (which is a `Subject` and only in charge of the notifications, not the actual data):

{{{diff_step 21.32}}}

We want a communication between PartiesUpload and PartiesForm. Let's use `Output` decorator and the `EventEmitter` to notify PartiesForm component about every new file.

{{{diff_step 21.33}}}

On the receiving side of this connection we have the PartiesForm component.

Create a method that handles an event with the new file and put images inside the FormBuilder.

{{{diff_step 21.34}}}

To keep Party interface up to date, we need to add `images` to it:

{{{diff_step 21.35}}}

The last step will be to create an event binding for `onFile`.

{{{diff_step 21.36}}}

### Display the main image of each party on the list

We will use Pipes to achieve this.

Let's create the `DisplayMainImagePipe` inside `client/imports/app/shared/display-main-image.pipe.ts`:

{{{diff_step 21.37}}}

Since we have it done, let's add it to PartiesList:

{{{diff_step 21.38}}}

We also need to subscribe to `images`:

{{{diff_step 21.39}}}

We can now just implement it:

{{{diff_step 21.40}}}

Add some css rules to keep the control of images:

{{{diff_step 21.41}}}

We still need to add the reset functionality to the component, since we want to manage what happens after images were added:

{{{diff_step 21.42}}}

By using `#upload` we get access to the PartiesUpload component's API. We can now use the `reset()`` method:

{{{diff_step 21.43}}}

And that's it!

### Cloud Storage

By storing files in the cloud you can reduce your costs and get a lot of other benefits.

Since this chapter is all about uploading files and UploadFS doesn't have built-in support for cloud services we should mention another library for that.

We recommend you to use [Slingshot](https://github.com/CulturalMe/meteor-slingshot/). You can install it by running:

    $ meteor add edgee:slingshot

It's very easy to use with AWS S3, Google Cloud and other cloud storage services.

From slignshot's repository:

> meteor-slingshot uploads the files directly to the cloud service from the browser without ever exposing your secret access key or any other sensitive data to the client and without requiring public write access to cloud storage to the entire public.
