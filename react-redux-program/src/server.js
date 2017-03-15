import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import HttpProxy from 'http-proxy';
import compression from 'compression';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import configureStore from './utils/configureStore';
import getRoutes from './routes';
import Html from './utils/Html';
import config from './config';

const app = new Express();
// 将端口号写在配置文件中，方便了部署时端口变动
const port = config.port;
// 使用htt-proxy, 将API服务器代理到前端服务器，主要用于解决跨域的问题，这里也可以直接使用代理服务器
const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const proxy = httpProxy.createProxyServer({
  target: targetUrl
});

// 采用Express的压缩扩展启动压缩，支持deflate和gzip
app.use(compression());
app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use((req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    webpackIsomorphicTools.refresh();
  }

  const store = configureStore();
  const routes = getRoutes(store);

  // 编写此函数用于禁止服务端渲染
  function hydrateOnClient() {
    res.send('<!doctype html>\n' + 
      renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();

    return;
  }

  match({ routes, location: req.url }, (err, redirect, renderProps) => {
    if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (err) {
      res.status(500);
      hydrateOnClient();
      console.error('ROUTER ERROR:', err.stack);
    } else if (renderProps) {
      res.status(200);
      const component = {
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      };
      res.send('<!doctype html>\n' + 
        renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />));
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Open http://%s:%s in a browser to view the app.', config.host, port);
  }
});



/*import path from 'path';
import Express from 'express';
import favicon from 'serve-favicon';
import httpProxy from 'http-proxy';
import compression from 'compression';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import configureStore from './utils/configureStore';
import getRoutes from './routes';
import Html from './utils/Html';
import config from './config';

const app = new Express();
// 将端口号写在配置文件中，方便了部署时端口变动
const port = config.port;
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const proxy = httpProxy.createProxyServer({
  target: targetUrl
});

app.use(compression());
app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use((req, res) => {
  global.__COOKIE__ = req.get('cookie');

  if (process.env.NODE_ENV !== 'production') {
    webpackIsomorphicTools.refresh();
  }

  const store = configureStore();
  const routes = getRoutes(store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ routes, location: req.url }, (err, redirect, renderProps) => {
    if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (err) {
      res.status(500);
      hydrateOnClient();
      console.error('ROUTER ERROR:', err.stack);
    } else if (renderProps) {
      res.status(200);
      const component = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      res.send('<!doctype html>\n' +
        renderToString(
          <Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>)
      );
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Open http://%s:%s in a browser to view the app.', config.host, port);
  }
});
*/