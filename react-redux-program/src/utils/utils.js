import 'isomorphic-fetch';
import config from '../config';

function handleErrors(res) {
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
}

export function customFetch(url, option) {
  const prefix = __SERVER__ ? 'http://' + config.apiHost + ':' + config.apiPort : '/api';
  const opt = option || {};

  return fetch(prefix + url, opt)
    .then(handleErrors);
}