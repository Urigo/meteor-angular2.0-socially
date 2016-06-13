import 'reflect-metadata';
import { Meteor } from 'meteor/meteor';
import { run as runWeb } from './imports/app/app.web';
import { run as runMobile } from './imports/app/app.mobile';

if (Meteor.isCordova) {
  document.addEventListener('deviceready', () => {
    runMobile();
  });
} else {
  runWeb();
}
