/* 启动API服务器 */

/* eslint-disable */
if (process.env.NODE_ENV === 'production') {
  require('../build/api/api');
} else {
  require('babel-register');
  require('../src/api/api');
}

/**
 * 这个配置文件无须配置Webpack同构工具，也没有定义全局变量，仅仅只是根据不同环境进行相应的配置
 * 最后使用NPM命令启动API服务器
 *
 * "start-api-dev": "nodemon --watch src/api bin/api.js",
 * "start-api-prod": "cross-env NODE_ENV=production node bin/api"
 */