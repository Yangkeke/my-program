/* 开发环境下的Webpack配置 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
// webpack同构工具
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

// 定义根路径，当前文件的上一层
var projectRootPath = path.resove(__dirname, '../');
// 定义输出路径，以后 assetsPath 即指 此文件夹
var assetsPath = path.resolve(projectRootPath, './static/dist');

/* 专门编写一个配置文件，用于盛放需要经常变动的变量： */
var config = require('../src/config');

module.exports = {
  // 开发工具~ cheap-eval-source-map重建速度快且首次构建更快些
  devtool: 'cheap-eval-source-map',
  context: projectRootPath,
  // 入口文件增加font-awesome-loader用于加载font-awesome
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
    'bootstrap-loader',
    'font-awesome-loader!./src/theme/font-awesome/font-awesome.config.js',
    './src/client'
  ],
  // 输出文件名增加哈希，用于防止缓存
  ourput: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + config.host + ':' + (config.port + 1) + '/dist/'
  },
  progress: true,
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __SERVER__: false
    }),
    new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools')).development()
  ],
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react-hmre']
        }
      },
      {
        test: /\.(jpeg|jpg|png|gif)$/,
        loader: 'url-loader?limit=10240'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?module&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
          'less'
        ],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      }
    ]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
}



/*var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(projectRootPath, './static/dist');

var config = require('../src/config');

module.exports = {
  devtool: 'cheap-eval-source-map',
  context: projectRootPath,
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
    'bootstrap-loader',
    'font-awesome-loader!./src/theme/font-awesome/font-awesome.config.js',
    './src/client'
  ],
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + config.host + ':' + (config.port + 1) + '/dist/'
  },
  progress: true,
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __SERVER__: false
    }),
    new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools')).development()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react-hmre']
        }
      },
      { test: /\.(jpeg|jpg|png|gif)$/, loader: 'url-loader?limit=10240' },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss',
          'sass'
        ]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      }
    ]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};
*/