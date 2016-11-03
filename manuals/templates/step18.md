In this chapter we will add Twitter's bootstrap to our project, and add some style and layout to the project.

# Adding and importing Bootstrap 4

First, we need to add Bootstrap 4 to our project - so let's do that.

Run the following command in your Terminal:

    $ meteor npm install --save bootstrap@4.0.0-alpha.3

 Import Bootstrap's styles into your project:

{{{diff_step 18.2}}}

# First touch of style

Now let's add some style! we will add navigation bar in the top of the page.

We will also add a container with the `router-outlet` to keep that content of the page:

{{{diff_step 18.3}}}

# Moving things around

So first thing we want to do now, is to move the login buttons to another place - let's say that we want it as a part of the navigation bar.

So first let's remove it from it's current place (parties list), first the view:

{{{diff_step 18.4}}}

And add it to the main component, which is the component that responsible to the navigation bar, so the view first:

{{{diff_step 18.5}}}

# Fonts and FontAwesome

Meteor gives you the control of your `head` tag, so you can import fonts and add your `meta` tags.

We will add a cool font and add [FontAwesome](https://fortawesome.github.io/Font-Awesome/) style file, which also contains it's font:

{{{diff_step 18.6}}}

# Some more style

So now we will take advantage of all Bootstrap's features - first let's update the layout of the form:

{{{diff_step 18.7}}}

And now the parties list:

{{{diff_step 18.8}}}

# Styling components

We will create style file for each component.

So let's start with the parties list, and add some style (it's not that critical at the moment what is the effect of those CSS rules)

{{{diff_step 18.9}}}

> Note that we used the "colors.scss" import - don't worry - we will add it soon!

And now let's add SASS file for the party details:

{{{diff_step 18.10}}}

Now let's add some styles and colors using SASS to the main file and create the colors definitions file we mentioned earlier:

{{{diff_step 18.11}}}

> We defined our colors in this file, and we used it all across the our application - so it's easy to change and modify the whole theme!

Now let's use Angular 2 Component styles, which bundles the styles into the Component, without effecting other Component's styles (you can red more about it [here](https://angular.io/docs/ts/latest/guide/component-styles.html))

So let's add it to the parties list:

{{{diff_step 18.12}}}

And to the party details:

{{{diff_step 18.13}}}

And use those new cool styles in the view of the party details:

{{{diff_step 18.14}}}


# Summary

So in this chapter of the tutorial we added the Bootstrap library and used it's layout and CSS styles.

We also learned how to integrate SASS compiler with Meteor and how to create isolated SASS styles for each component.
