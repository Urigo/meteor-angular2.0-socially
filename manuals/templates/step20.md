This part of the tutorial will cover the usage of third-party libraries with angular2-meteor.

Parts of this tutorial are also relevant for users who uses only Meteor, without angular2-meteor, because the solution for third-party libraries comes from Meteor packaging manager - **Atmosphere**.

With release of Meteor 1.3 it is also possible to use **NPM**! It opens a lot of new opportunities. In fact, if it possible you should always use packages from NPM instead of Atmosphere.

In this part of the tutorial we will show multiple solution for the same problem - using third-party libraries with Meteor and angular2-meteor.


Every Angular 2 developer knows and uses third-party libraries, but because we do not have the ability to easily include the ".js" file on our "head" tag - we need another solutions.

# NPM

To use third-party libraries in your Meteor project - you can easily use

    meteor npm install PACKAGE_NAME --save

command to add the new package.

For example, in order to use **[ng2-pagination](https://www.npmjs.com/package/ng2-pagination)** in your project, easily run this command:

    meteor npm install ng2-pagination --save

You need to import the external module into your own `NgModule`, like we did in the previous steps.

And then just use the ng2-pagination on your angular2-meteor project:

```js
import {
  Component,
} from '@angular/core';

import {
  PaginatePipe,
  PaginationControlsCmp,
  PaginationService,
} from 'ng2-pagination';

@Component({
  selector: 'my-component',
  template: `
    <ul>
      <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p }"> ... </li>
    </ul>

    <pagination-controls (pageChange)="p = $event"></pagination-controls>
  `
})
export class MyComponent {
  public collection: any[] = someArrayOfThings;  
}

```

# Atmosphere

In order to add third-party libraries to your Meteor project - you can use the `meteor add PACKAGE_NAME` command to add the package.

Also, for **most** of the Angular 2 third-party libraries - there's already a Meteor package (which is an equivalent to bower or NPM).

You can search for those packages using the [Atmosphere](https://atmospherejs.com/) website.

But as we said before, the most recommended practice is to use a package from NPM, instead of its equivalent in Atmopshere which in the most cases is just a wrapper package.

For example, in order to use **[ng2-pagination](https://atmospherejs.com/barbatus/ng2-pagination)** in your project, easily run this command:

```
meteor add barbatus:ng2-pagination
```

And then just use the ng2-pagination on your angular2-meteor project:

```js
import {
  PaginatePipe,
  PaginationControlsCmp,
  PaginationService,
} from 'meteor/barbatus:ng2-pagination';
```

# More about packages

Atmosphere packages has few advantages over node modules. The most important one is that you cannot specify in node module which files should be on the client-side and which will be used on the server-side. You can always create two packages with -client and -server suffixes.

We recommend you to read more about packages in [Meteor Docs](http://docs.meteor.com/#/full/packagejs).
