/* 独立的开发服务器 */
// 为了不让前端服务器阻碍开发服务器的运行，这里将开发服务器独立出来

var Express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./dev.config');

var app = new Express();
var port = require('../src/config').port + 1;
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🚧  Webpack development server listening on port ${port}.`)
  }
});



/*var Express = require('express');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./dev.config');

var app = new Express();
var port = require('../src/config').port + 1;

var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🚧  Webpack development server listening on port ${port}.`)
  }
});
*/