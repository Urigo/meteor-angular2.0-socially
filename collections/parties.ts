/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/party.d.ts" />

export var Parties = new Mongo.Collection<Party>('parties');

Parties.allow({
  insert: function(party: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(party: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(party: Object) {
    var user = Meteor.user();
    return !!user;
  }
});
