[{]: <region> (header)
# Step 2: Static Template
[}]: #
[{]: <region> (body)
Let's create a purely static HTML page and then examine how we can turn this HTML code into a template that Angular will use to dynamically display the same result with any set of data.

Add this template HTML to `app.html`:

[{]: <helper> (diff_step 2.1)
#### Step 2.1: Add static HTML to the main component view

##### Changed client/imports/app/app.component.html
```diff
@@ -1 +1,14 @@
-┊ 1┊  ┊Hello World!🚫↵
+┊  ┊ 1┊<ul>
+┊  ┊ 2┊  <li>
+┊  ┊ 3┊    <span>Dubstep-Free Zone</span>
+┊  ┊ 4┊    <p>
+┊  ┊ 5┊      Can we please just for an evening not listen to dubstep.
+┊  ┊ 6┊    </p>
+┊  ┊ 7┊  </li>
+┊  ┊ 8┊  <li>
+┊  ┊ 9┊    <span>All dubstep all the time</span>
+┊  ┊10┊    <p>
+┊  ┊11┊      Get it on!
+┊  ┊12┊    </p>
+┊  ┊13┊  </li>
+┊  ┊14┊</ul>🚫↵
```
[}]: #

Now, let's go to the [next step](/tutorials/angular2/dynamic-template) and learn how to dynamically generate the same list using Angular 2.

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step1.md) | [Next Step >](step3.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #