Ionic is a CSS and JavaScript framework. It is highly recommended that before starting this step you will get yourself familiar with its [documentation](http://ionicframework.com/docs/v2).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications.

We will achieve this by creating separate views for web and for mobile  so be creating a separate view for the mobile applications, but we will keep the shared code parts as common code!

### Adding Ionic

Using ionic is pretty simple - first, we need to install it:

    $ meteor npm install ionic-angular --save

We also have to install missing packages that required by Ionic:

    $ meteor npm install @angular/http @angular/platform-server --save

### Separate web and mobile things

We are going to have two different `NgModule`s, because of the differences in the imports and declarations between the two platforms (web and Ionic).

We will also separate the main `Component` that in use.

So let's start with the `AppComponent` that needed to be change to `app.component.web.ts`, and it's template that ness to be called `app.component.web.html`.

Now update the usage of the template in the Component:

{{{diff_step 23.4}}}

And modify the import path in the module file:

{{{diff_step 23.5}}}

Now let's take back the code we modified in the previous step (#21) and use only the original version of the Login component, because we do not want to have login in our Ionic version (it will be read only):

{{{diff_step 23.6}}}

Create a root Component for the mobile, and call it `AppMobileComponent`:

{{{diff_step 23.7}}}

And let's create it's view:

{{{diff_step 23.8}}}

We used `ion-nav` which is the navigation bar of Ionic, we also declared that our root page is `rootPage` which we will add later.

Now let's create an index file for the ionic component declarations:

{{{diff_step 23.9}}}

## Modules Separation

In order to create two different versions of `NgModule` - one for each platform, we need to identify which platform are we running now - we already know how to do this from the previous step - we will use `Meteor.isCordova`.

We will have a single `NgModule` called `AppModule`, but it's declaration will be different according to the platform.

So we already know how the web module looks like, we just need to understand how mobile module defined when working with Ionic.

First - we need to import `IonicModule` and declare our root Component there.

We also need to declare `IonicApp` as our `bootstrap` Component, and add every Ionic `page` to the `entryComponents`.

So let's create it and differ the platform:

{{{diff_step 23.10}}}

Our next step is to change our selector of the root Component.

As we already know, the root Component of the web platform uses `<app>` tag as the selector, but in our case the root Component has to be `IonicApp` that uses `<ion-app>` tag.

So we need to have the ability to switch `<app>` to `<ion-app>` when using mobile platform.

There is a package called `ionic-selector` we can use in order to get this done, so let's add it:

    $ meteor npm install --save ionic-selector

Now let's use in before bootstrapping our module:

{{{diff_step 23.12}}}

What it does? It's changing tag name of the main component (`app` by default but you can specify any selector you want) to `ion-app`.

An example:

```html
<body>
  <app class="main"></app>
</body>
```

will be changed to:

```html
<body>
  <ion-app class="main"></ion-app>
</body>
```

## Ionic styles & icons

Our next step is to load Ionic style and icons (called `ionicons`) only to the mobile platform.

Start by adding the icons package:

    $ meteor npm install --save ionicons

Also, let's create a style file for the mobile and Ionic styles, and load the icons package to it:

{{{diff_step 23.14}}}

And let's imports this file into our main styles file:

{{{diff_step 23.15}}}

Now we need to load Ionic stylesheet into our project - but we need to load it only to the mobile platform, without loading it to the web platform (otherwise, it will override our styles):

{{{diff_step 23.16}}}

We also need to add some CSS classes in order to get a good result:

{{{diff_step 23.17}}}

And let's add the correct class to the `body`:

{{{diff_step 23.18}}}

> We created a mechanism that adds `web` or `mobile` class to `<body/>` element depends on environment.

## Share logic between platforms

We want to share the logic of `PartiesListComponent` without sharing it's styles and template - because we want a different looks between the platforms.

In order to do so, let's take all of the logic we have in `PartiesListComponent` and take it to an external file that won't contain the Component decorator:

{{{diff_step 23.19}}}

And let's clean up the `PartiesListComponent`, and use the new class `PartiesList` as base class for this Component:

{{{diff_step 23.20}}}

Now let's create a basic view and layout for the mobile platform, be creating a new Component called `PartiesListMobile`, starting with the view:

{{{diff_step 23.21}}}

And it's Component, which is very similar to the web version, only it uses different template:

{{{diff_step 23.22}}}

Now let's add the mobile Component of the parties list to the index file:

{{{diff_step 23.23}}}

And let's add the Component we just created as `rootPage` for our Ionic application:

{{{diff_step 23.24}}}

Now we just need declare this Component as `entryComponents` in the `NgModule` definition, and make sure we have all the required external modules in the `NgModule` that loaded for the mobile:

{{{diff_step 23.25}}}

Now we want to add the actual view to the mobile Component, so let's do it:

{{{diff_step 23.26}}}

> We used `ion-card` which is an Ionic Component.

And in order to have the ability to load images in the mobile platform, we need to add some logic to the `displayMainImage` Pipe, because Meteor's absolute URL is not the same in mobile:

{{{diff_step 23.27}}}

And let's add the image to the view:

{{{diff_step 23.28}}}

### Fixing fonts

As you probably notice, there are many warnings about missing fonts. We can easily fix it with the help of a package called [`mys:fonts`](https://github.com/jellyjs/meteor-fonts).

    $ meteor add mys:fonts

That plugin needs to know which font we want to use and where it should be available.

Configuration is pretty easy, you will catch it by just looking on an example:

{{{diff_step 23.30}}}

Now `roboto-regular.ttf` is available under `http://localhost:3000/fonts/roboto-regular.ttf`.

And... You have an app that works with Ionic!

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view for both, web and mobile.

We also learned how to share component between platforms, and change the view only!

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.
