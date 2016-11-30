var express = require('express')
var router = express.Router()

router.get('/:name', function(req, res) {
  res.render('users', {
    name: req.params.name,
    supplies: ['mop', 'broom', 'duster']
  })
})

module.exports = router

/**
 * 以上代码的意思是：我们将 / 和 /users:name 的路由分别放到了routers/index.js 和 routes/user.js中。
 * 每个路由文件通过生成一个express.Router实例router并导出，通过app.use挂载到不同的路径。
 * 这两种代码实现了相同的功能，但在实际开发中推荐使用express.Router将不同的路由分离到不同的路由文件中。
 */


/**
 * 通过调用res.render模板渲染ejs模板，res.render第一个参数是模板的名字，这里是users则会匹配views/users.ejs
 * 第二个参数是传给模板的数据，这里传入name, 则在ejs模板中可使用name.
 * res.render的作用就是将模板和数据结合生成html, 同时设置响应头的Content-Type: text/html
 * 告诉浏览器我们返回的是html,不是纯文本，要按html展示。
 */


// <% code %>：运行 JavaScript 代码，不输出
// <%= code %>：显示转义后的 HTML内容
// <%- code %>：显示原始 HTML 内容