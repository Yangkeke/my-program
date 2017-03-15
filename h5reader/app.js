var koa = require('koa');
var controller = require('koa-route');
var app = koa();

app.use(controller.get('route_test'), function*() {
  this.body = 'hello, koa';
})

