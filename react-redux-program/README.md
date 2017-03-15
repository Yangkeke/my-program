# React Redux Book 的一个例子

npm install
npm start
npm run prod
npm test

参考了 react-redux-universal-hot-example等~

实现功能如下：

1. 进入主页，用于介绍，展示信息（静态页）
2. nav 第二个页面是个计数器，用于显示服务器传来的随机数，并可以实现数值的加、减以及重新加载
3. 当找不到路径时会显示404页面，给出页面不存在的提示
4. 程序中一旦发生异步请求，将会在页面中心出现等待图标

为实现上述功能，需编写三个服务器：

* 开发服务器，用于在开发环境下提供热替换服务。（生产环境毋须启动）
* 前端服务器，用于请求数据、渲染页面和代理API服务。
* API服务器，用于提供API服务。

为了在不同环境下完成服务器的启动以及资源的构建编译任务，还编写了：

* 两个启动文件，用于在不同环境下启动服务。开发环境下使用Babel的Require Hook启动服务，生产环境则先编译后启动。
* 两个Webpack配置文件，用于在不同环境编译客户端资源。

### 主要目录结构：

react-redux-program
  ...
  /src
    /utils                         工具集和辅助模块  这里放置函数
    ...
    config.js                      用于盛放经常需要变动的变量
    server.js                      配置前端服务器    
  /static
  /webpack
    dev.config.js                  独立的开发服务器
    prod.config.js                 
    webpack-dev-server.js
    webpack-isomorphic-tools.js    同构工具配置
  ...


#### package.json - scripts

// 监视客户端变动，在port+1端口开启服务，随时给客户端提供资源，并在代码变动时进行热替换
"watch-client": "node webpack/webpack-dev-server",



### API服务器

Universal渲染的服务端资的是前端服务器，尽管可以在前端服务器中进行读/写数据库、用户认证等，但是由于前端服务器和客户端公用一套代码，所以不管出于安全的考虑，还是因为模块分离方面的因素，都应该将API服务器独立出去。

#### 配置API服务器


...


### 生产环境下的构建编译


编译运行Node.js

在生产环境下， 应该先使用Babel编译Node.js程序，然后使用node运行。

首先，删除上次编译的老旧文件，rimraf是Node.js的一个删除工具，相当于rm -rf。这里不仅仅删除了build文件夹，也删除了Webpack的目标路径，即static/dist文件夹。

"clean": "rimraf build static/dist"     然后使用babel编译：
src代表源文件目录， 
-d build代表目标路径为build, 
--copy-files代表将非JS文件也拷贝到目标文件中

"build-server": "babel src -d build --copy-fileds"

最后，直接用node运行

"start-prod": "cross-env NODE_ENV=production node bin/server",
...
"start-api-prod": "cross-env NODE_ENV=production node bin/api"

注意： 生产环境下，入口文件已经发生了改变。



### 生产环境下的Webpack配置

在生产环境中，不需要使用开发服务器来提供资源，而是直接讲起打包到静态资源目录，然后在页面中引入入口文件即可。

webpack/prod.config.js
  ...


与开发环境相比，发生了以下改动：

1. devtool设置为source-map, 这种模式构建速度非常慢，但是会生成完整的源代码映射，适用于生产环境
2. 在入口文件列表中去除了热替换文件，在bootstrap后面添加了extractStyles，用于提取独立的文件。 Font Awesome的配置文件和客户端入口都发生了变化
3. output.publicPath从开发服务器的服务路径改为了/dist/, 代表资源文件从前端服务器中加载
4. 插件列表添加了ExtractTextPlugin，用于提取样式文件，还添加了DedupePlugin和UglifyJsPlugin用于去重和压缩。另外，去除了 HotModuleReplacementPlugin插件，取消了Webpack同构工具的开发模式
5. 加载器列表移除了对JS文件的处理，因为使用build/client作为入口的话，就无须再使用babel进行编译了。样式的加载器均添加了ExtractTextPlugin配置

接下来，编写NPM命令启动客户端资源的编译：
"build-client": "webpack --fongif webpack/prod.config.js",

最后需要编写两个NPM命令，用于在不同环境下启动所有的构建编译任务:
"prod": npm run build && concurrently -k \"npm  run 




### 路由与页面

src/routes.js