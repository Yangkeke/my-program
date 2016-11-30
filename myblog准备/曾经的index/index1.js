var path = require('path')
var express = require('express')
var app = express()

var indexRouter = require('./routes/index')
var userRouter = require('./routes/users')

// 设置存放模板文件的目录
app.set('views', path.join(__dirname, 'views'))  
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/users', userRouter)

app.listen(3000)




/*var express = require('express')
var app = express()

// 访问根路径时，毅然返回hello, express
// 当访问localhost:3000/users/abc 返回 hello, abc
// 路径中 :name 起了占位符的作用，
// 这个占位符的名字是name,可以通过req.params.name取到实际的值··
app.get('/', function(req, res) {
  res.send('hello, express')
})

app.get('/users/:name', function(req, res) {
  res.send('hello ' + '这里可以取到req.params.name: ' + req.params.name)
})

app.listen(3000)

/**
 * 这里介绍几个常用的req属性
 *
 * req.query: 解析后的url中的querystring, 如?name=haha, req.query的值为 {name: 'haha'}
 * req.params: 解析后的url中的占位符, 如/:name, 访问/haha, req.params的值为 {name: 'haha'}
 * req.body: 解析后的请求体, 需要相关的模块，如body-parser, 请求体为 {"name": "haha"}，则req.body为 {name: 'haha'}
 */


