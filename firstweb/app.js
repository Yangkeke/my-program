// 01 使用express服务
var express = require('express')
// 10 引入path模块
var path = require('path')
// 14 引入mongoose工具，连接数据库
var mongoose = require('mongoose')
// 17 将模型加载进来 添加underscore 方法
var Movie = require('./models/movie')
var _ = require('underscore')

// 02 设置端口
var port = process.env.PORT || 3000
// 03 启动web服务器
var app = express()
// 13 第13步需安装express的中间件
var bodyParser = require('body-parser');

// 15 连接数据库
mongoose.connect('mongodb://localhost:27017')

// 04 设置视图的根目录
// app.set('views', './views')

// 12 更改视图目录
app.set('views', './views/pages')

// 05 设置默认的模版引擎 jade
app.set('view engine', 'jade')
// 13将后台表单数据格式化
app.use(bodyParser.urlencoded({extended: true}))

// 11 使用到的静态资源路径
// express.static(root, option) 第一个参数是设置根路径~（前缀） 相对于哪开始找, 第二个是静态文件的路径， 这里设到www也就是说 绝对路径静态资源是从/www里找， 写的话， 如模板，从/static即可
app.use(express.static(path.join(__dirname, '/www')))

app.locals.moment = require('moment')
// 06 监听端口
app.listen(port)

console.log('firstweb started on port' + port);

// 07 创建views里的各jade模板
 
// 08 编写路由
// 09 mock数据（以下 render 的内容都是模拟 mock出来的）
// 首页 
app.get('/', function(req, res) {
  // 16 调用数据模型, 在回调中拿到数据
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }

    res.render('index', {
      title: 'FirstWeb 首页',
      movies: movies
    })
  })
})
// 详情页  :id 指 在url里能匹配到/后面的值
app.get('/movie/:id', function(req, res) {
  //Node.js 取参四种方法req.body, req.params, req.param, req.body
  // 通过req.params.id拿到后面的具体id值
  var id = req.params.id

  // 通过模式里的API方法, 拿到查询到的数据movie
  Movie.findById(id, function(err, movie) {
    res.render('detail', {
      title: `FirstWeb ${movie.title}`,
      movie: movie
    })
  })  
})
// 后台录入页
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: 'FirstWeb 后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

// admin update movie
// 该地址拿到后就是更新电影
app.get('/admin/update/:id', function(res, req) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie) {
      // 拿到电影数据后，渲染表单
      res.render('admin', {
        title: 'FirstWeb 后台更新页',
        movie: movie
      })
    })
  }
})

// admin post movie 新建从后台输入拿到的新页面
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  // 如果id不是undefined, 说明电影已存储到数据库
  if (id !== 'undefined') {
    Movie.findById(id, function(err, res) {
      if (err) {
        console.log(err)
      }
      // 用post过来的数据，替换掉老的数据
      // _(查询到的movie对象, 调用的movie对象)
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
        // 若电影数据更新或存储成功，将页面重定向到电影对应的详情页
        res.redirect(`/movie/${movie.id}`)
      })
    })
  } else {
    // 新加的电影 处理
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })

    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      // 若电影数据更新或存储成功，将页面重定向到电影对应的详情页
      res.redirect(`/movie/${movie.id}`)
    })
  }
})

// 列表页
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if (err) {
      console.log(err);
    }

    res.render('list', {
      title: 'FirstWeb 列表页',
      movies: movies
    })
  })  
})