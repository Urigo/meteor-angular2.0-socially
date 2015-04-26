# rtts-assert

This is a copy of https://github.com/angular/assert modified to work with Meteor.

Used version: https://github.com/angular/assert/commit/6caafd2561ece8cbfdabbe7357b50ce9192db18c

## How to convert assert.next.js to assert.js

1. `traceur --modules=commonjs --out rtts-assert/assert.js rtts-assert/assert.next.js`
2. Remove exports code on the top
3. Make assert function global
