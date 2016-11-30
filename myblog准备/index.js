/**
 * 上面的自理中，应用程序为我们自动返回了错误栈信息
 * express内置了一个默认的错误处理器, 假如我们想手动控制返回的错误内容，
 * 则需要加载一个自定义错误处理的中间件，修改index.js如下：
 */

var express = require('express')
var app = express()

app.use(function(req, res, next) {
  console.log('1')
  next(new Error('haha'))
})

app.use(function(req, res, next) {
  console.log('2')
  res.status(200).end()
})

// 错误处理
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000)