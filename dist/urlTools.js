"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom Object.keys
 * @param {IKeyValue} source
 * @returns {string[]}
 */
const getKeys = (source = {}) => {
  const keys = [];
  for (const i in source) {
    if (source.hasOwnProperty(i)) {
      keys.push(i);
    }
  }
  return keys;
};
/**
 * Adds a GET param to an url
 * @param {string} url
 * @param {object} params - key/value list of params
 */
exports.addUrlParams = (url, params) => {
  if (!params) {
    return url;
  }
  const keys = getKeys(params);
  if (!keys.length) {
    return url;
  }
  const paramsString = keys
    .map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join("&");
  return url.indexOf("?") === -1
    ? `${url}?${paramsString}`
    : `${url}&${paramsString}`;
};
//# sourceMappingURL=urlTools.js.map
