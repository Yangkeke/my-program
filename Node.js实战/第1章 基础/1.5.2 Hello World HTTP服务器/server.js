var http = require('http')
var server = require('server')

server.on('request', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/palin'})
  res.end('Hello World!\n')
})

server.listen(3000)
console.log('Server running at http://localhost:3000/');