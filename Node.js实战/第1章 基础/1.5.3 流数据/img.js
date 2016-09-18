var http = require('http')
var fs = require('fs')

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'image/jpg'})
  fs.createReadStream('./me.jpg').pipe(res)
}).listen(3000)

console.log('Server running at http://localholst:3000/');