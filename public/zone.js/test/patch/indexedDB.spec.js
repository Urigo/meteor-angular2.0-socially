'use strict';

xdescribe('indexedDB', function () {
  var db,
      request,
      hasParent,
      flag;

  beforeEach(function () {
    hasParent = false;
    flag = false;
  });

  afterEach(function () {
    indexedDB.deleteDatabase('library')
  });

  describe('upgradeneeded callback', function () {
    it('should run inside the zone', function () {
      runs(function () {
        request = indexedDB.open('library');
        request.onupgradeneeded = function() {
          db = request.result;
          var store = db.createObjectStore('books', {
            keyPath: 'isbn'
          });
          store.put({
            title: 'Quarry Memories',
            author: 'Fred',
            isbn: 123456
          });
        };
        request.success = function() {
          //db = request.result;
          hasParent = !!window.zone.parent;
          flag = true;
        };
      });

      waitsFor(function() {
        return flag;
      }, 'request to succeed', 100);

      runs(function() {
        expect(hasParent).toBe(true);
      });
    })
  });

  describe('success callback', function () {
    beforeEach(function () {
      request = indexedDB.open('library');
      request.onupgradeneeded = function() {
        db = request.result;
        var store = db.createObjectStore('books', {
          keyPath: 'isbn'
        });
        store.put({
          title: 'Quarry Memories',
          author: 'Fred',
          isbn: 123456
        });
      };
    });

    it('should run in the zone with addEventListener', function () {
      runs(function () {
        request.addEventListener('success', function() {
          db = request.result;
          hasParent = !!window.zone.parent;
          flag = true;
        });
      });

      waitsFor(function() {
        return flag;
      }, 'request to succeed', 100);

      runs(function() {
        expect(hasParent).toBe(true);
      });
    });

    it('should run in the zone with onsuccess', function () {
      runs(function() {
        request.onsuccess = function() {
          db = request.result;
          hasParent = !!window.zone.parent;
          flag = true;
        };
      });

      waitsFor(function() {
        return flag;
      }, 'request to succeed', 100);

      runs(function() {
        expect(hasParent).toBe(true);
      });
    });

  });
});
