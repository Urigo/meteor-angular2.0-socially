'use strict';

describe('JSONP', function () {

  /*
  it('should wrap a JSONP callback', function (done) {
    expect(true).toBe(true);
    babysFirstJsonpLib('x', function () {
      done();
    });
  });
  */
});

function babysFirstJsonpLib (data, cb) {
  window.jsonp = cb;
  var script = document.createElement('script');
  script.src =  'http://localhost:8002?data=' + JSON.stringify(data);
  document.body.appendChild(script);
}
