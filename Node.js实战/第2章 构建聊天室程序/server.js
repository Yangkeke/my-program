/* 
* @Author: fys
* @Date:   2016-09-18 11:19:18
* @Last Modified time: 2016-09-18 13:41:07
*/


// 内置的http模块提供了HTTP服务器和客户端功能
var http = require('http')

// 内置的path模块提供了与文件系统路径相关的功能
var fs = require('fs') 
var path = require('path')

// 附加的mime模块有genuine文件扩展名得出MIME类型的能力
var mime = require('mime')

// cache是用来缓存文件内容的对象
var cache = {}

// 1. 发送文件数据及错误响应
function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.write('Error 404: resource not found.')
  res.end()
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))})
  res.end(fileContents)
}

function serveStatic(res, cache, absPath) {

  // 检查文件是否缓存在内存中
  if (cache[absPath]) {

    // 从内存中返回文件
    sendFile(res, absPath, cache[absPath])

  } else {

    // 检查文件是否存在
    fs.exists(absPath, function(exists) {
      if (exists) {

        // 从硬盘中读取文件
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(res)

          } else {

            // 从硬盘中读取文件并返回
            cache[absPath] = data
            sendFile(res,absPath, data)
          }
        })
      } else {

        // 发送HTTP 404响应
        send404(res)
      }
    })
  }
}

// 2. 创建HTTP服务器
var server = http.createServer(function(req, res) {
  var filePath = false;

  if (req.url == '') {
    filePath = 'public/index.html'
  } else {
    filePath = 'public' + req.url
  }

  var absPath = './' + filePath
  serverStatic(res, cache, absPath)
})

// 3. 启动HTTP服务器
server.listen(3000, function() {
  console.log("Server listening on port 3000.");
})


/* 设置Socket.IO 服务器 */
var chartServer = require('./lib/chat_server')
ChatServer.listen(server)