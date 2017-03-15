import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Main, Home, Counter, NotFound, Forms, Statistic, Login } from './containers';
import { loadCounter } from './actions/counter';
import { loadStatistic } from './actions/statistic';
import { loadAuthIfNeeded } from './actions/auth';

const preload = promise => (nextState, replace, cb) => {
  if (__SERVER__ || nextState.location.action === 'PUSH') {
    promise().then(() => cb());
  } else {
    cb();
  }
}

export default store => {
  const counterPromise = () => store.dispatch(loadCounter());

  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Home} />
      <Route path="counter" component={Counter} onEnter={preload(counterPromise)} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
}

/**
 * Home 主页
 * Counter 计数器
 * NotFound 404页面
 *
 * Main组件则是所有页面公用的父级页面
 */