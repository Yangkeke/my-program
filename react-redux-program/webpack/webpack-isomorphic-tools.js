/* webpack同构工具的配置 */

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

var config = {
  assets: {
    images: {extensions: ['png']},
    style_modules: {
      extensions: ['css', 'scss'],
      filter: function (module, regex, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
        } else {
          return regex.test(module.name);
        }
      },
      path: function (module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
        } else {
          return module.name;
        }
      },
      parser: function (module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
        } else {
          return module.source;
        }
      }
    }
  }
};

module.exports = config;

/**
 * 与之前相比，这里增加了对options.development的条件判断：
 * 若条件成立，则表开发环境，将返回使 适用于style-loader和css-loader的返回值；
 * 若条件不成立，则表生产环境，因生产环境不使用style-loader而是提取为单独的样式文件，返回默认值即可。
 */