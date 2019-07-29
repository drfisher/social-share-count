"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urlTools_1 = require("./urlTools");
const JSONP_REJECT_TIMEOUT = 10000;
const cache = {
  callbackNames: {},
  data: {}
};
/**
 * Loads a resource
 * @param {string} url
 * @returns {Promise<any>}
 */
const request = url => {
  const { data } = cache;
  return data[url] ? Promise.resolve(data[url]) : jsonpRequest(url);
};
/**
 * Creates a jsonp request
 * @param url
 * @returns {Promise<any>}
 */
const jsonpRequest = url =>
  new Promise((resolve, reject) => {
    const callbackName = createCallbackName();
    const scriptSrc = urlTools_1.addUrlParams(url, { callbackName });
    let rejectTimeout;
    // Callback function
    window[callbackName] = data => {
      clearTimeout(rejectTimeout);
      script.removeEventListener("error", reject);
      cache.data[url] = data;
      clearAfterJsonp(script, callbackName);
      resolve(data);
    };
    // Script with data
    const script = document.createElement("script");
    script.addEventListener("error", reject);
    script.setAttribute("asynct", "async");
    script.src = scriptSrc;
    document.head.appendChild(script);
    // It could be a script without a callback
    // so reject it after timeout
    rejectTimeout = window.setTimeout(() => {
      clearAfterJsonp(script, callbackName);
      reject();
    }, JSONP_REJECT_TIMEOUT);
  });
/**
 * Removes event listeners and global properties
 * @param {HTMLScriptElement} script
 * @param {string} callbackName
 */
const clearAfterJsonp = (script, callbackName) => {
  document.head.removeChild(script);
  delete window[callbackName];
};
/**
 * @returns {string} a uniq callback name
 */
const createCallbackName = () => {
  let callbackName;
  do {
    callbackName = `jsonp_${(Math.random() + "").split(".")[1]}`;
  } while (callbackName in cache.callbackNames || callbackName in window);
  cache.callbackNames[callbackName] = 1;
  return callbackName;
};
exports.default = request;
//# sourceMappingURL=request.js.map
