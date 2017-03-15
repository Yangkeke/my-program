import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from'serialize-javascript';
import Helmet from 'react-helmet';

function Html(props) {
  const { assets, component, store } = props;
  const component = component ? ReactDOM.renderToString(component) : '';
  const head = Helmet.rewind();

  return (
    <html>
      <head>
        {head.base.toComponent()}
        {head.base.toComponent()}
        {head.base.toComponent()}
        {head.base.toComponent()}
        {head.base.toComponent()}
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {Object.keys(assets.styles.map(style, key) => 
          <link
            href={assets.styles[style]}
            key={key}
            media="screen, projection"
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
          />
        )}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHtml={{ __html: content }} />
        <script 
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__=${serialize(store.getState())}`
          }}
          charSet="UTF-8"
        />
        <script
          src={assets.javascript.main} 
          charSet="UTF-8"
        />
      </body>
    </html>
  );
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
}

export default Html;

/**
 * 这个组件做了以下：
 *
 * 1. 接收webpack同构工具提供的键值对对象、React组件component以及Redux的store作为props
 *     const { assets, component, store } = props;
 *
 * 2. 使用react-helmet管理文档头信息，包括title meta link script和base tags
 *
 * 3. 通过遍历webpack同构工具提供的资源键值对对象，给HTML添加独立出来的样式文件。
 *     注意：只有在生产环境下，assets.styles才包含数据
 *
 * 4. 使用dangerouslySetInnerHTML渲染HTML字符串到组件中。默认情况下，React会对HTML进行编码来防止XSS攻击。
 *
 * 5. 渲染来自服务端的预载state和用于客户端渲染的脚本文件。serialize用于将JSON转换为字符串，它和JSON.stringify()的区别在于可以输出JSON中的函数和正则表达式。另外，它也包含自动编码功能来防止XSS攻击。
 */