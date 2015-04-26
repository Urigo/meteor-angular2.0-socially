var http = require('http');

var server = http.createServer(requestHandler);

function requestHandler(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<script>jsonp({ data: 42 })</script>');
}

server.listen(8002);
