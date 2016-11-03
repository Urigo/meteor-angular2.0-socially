[{]: <region> (header)
# Step 11: Deploying your app
[}]: #
[{]: <region> (body)
Now that we have a working app, we can go public!

One way to operate your app with confidence is to use Galaxy, the service built by Meteor Development Group specifically to run Meteor apps.

In order to deploy to Galaxy, you’ll need to sign up for an account [here](https://www.meteor.com/galaxy/signup), and separately provision a MongoDB database later.

Simply type in the command line of your app directory
(replace `your-app` with your own name):

    DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy your-app.com

In order for Galaxy to work with your custom domain (your-app.com in this case), you need to [set up your DNS to point at Galaxy](https://galaxy.meteor.com/help/configuring-dns). Once you’ve done this, you should be able to reach your site from a browser.

For full Galaxy deployment tutorial, please follow [here](http://guide.meteor.com/deployment.html#deployment-options).

Now try to play around with the deployed app on different devices.
This might be in a browser on your mobile phone, a laptop or a desktop computer.

Add, remove and change some parties and you will see that all opened versions of the app update
almost simultaneously on different devices.

UI updates of a Meteor app are fast, user-friendly and reliable,
thanks to WebSockets, latency compensation and different complex concepts realized in Meteor.

# Summary

Congratulations, you've made a working app that you can now use with your friends!

You can download the source code of the app up to this point [here](https://github.com/Urigo/meteor-angular2.0-socially/archive/step_09.zip).

In the next step, we'll take a detour to see that while we were building a web app, we've also created a pretty nice mobile app along the way.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step10.md) | [Next Step >](step12.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #