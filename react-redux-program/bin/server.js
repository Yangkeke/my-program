/* 为了在不同环境下启动前端服务器 */

/* eslint-disable */
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;

if (process.env.NODE_ENV === 'production') {
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    require('../webpack/webpack-isomorphic-tools'))
      .server(rootDir, function() {
        require('../build/server');
      });
} else {
  require('babel-register');
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    require('../webpack/webpack-isomorphic-tools'))
      .development()
      .server(rootDir, function() {
        require('../src/server');
      });
}

/**
 * 这个启动文件配置了webpack同构工具，定义了一些全局变量，并根据环境的不同进行相应的配置
 * 最后使用NPM命令启动前端服务器。在开发环境下，使用nodemon替代node，
 * 在每次src文件夹中的文件发生变动时，能自动重启，提高开发效率
 *
 * "start-prod": "cross-env NODE_ENV=production node bin/server"
 * "start-dev": "nodemon --watch src bin/server.js"
 */