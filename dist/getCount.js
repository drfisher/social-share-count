"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const urlTools_1 = require("./urlTools");
/**
 * Callback wrapper for some networks
 * @param id - callback id
 * @param count
 */
const execCountCallback = (id, count) => {
  const curCallback = callbacks[id];
  if (typeof curCallback === "function") {
    callbacks[id] = null;
    curCallback.call(null, count);
  }
};
/*
 * Fake API for some networks:
 *   ODKL.updateCount('null','0');
 *   VK.Share.count(0, 2);
 */
window.VK = {
  Share: {
    count: execCountCallback
  }
};
window.ODKL = {
  updateCount: execCountCallback
};
const callbacks = [];
const networkParams = {
  facebook: {
    getCount(data) {
      let count = 0;
      if (data && data.share) {
        count = data.share.share_count || count;
      }
      return count;
    },
    params: {
      url: "id"
    },
    url: "https://graph.facebook.com/"
  },
  ok: {
    params: {
      id: "uid",
      url: "ref"
    },
    url: "https://connect.ok.ru/dk?st.cmd=extLike"
  },
  vk: {
    params: {
      id: "index",
      url: "url"
    },
    url: "https://vk.com/share.php?act=count&format=json"
  }
};
/**
 * Gets a count of shares from a social network
 * @param params
 * @propery params.networkName - type of social network
 * @propery params.url - url to check
 * @returns {Promise<number>}
 */
exports.getCount = params => {
  const typeParams = networkParams[params.networkName];
  const requestParams = {
    [typeParams.params.url]: params.url
  };
  return typeParams.getCount
    ? request_1
        .default(urlTools_1.addUrlParams(typeParams.url, requestParams))
        .then(data => (typeParams.getCount ? typeParams.getCount(data) : 0))
    : new Promise((resolve, reject) => {
        requestParams[typeParams.params.id || 0] = addCallback(resolve);
        request_1
          .default(urlTools_1.addUrlParams(typeParams.url, requestParams))
          .catch(reject);
      });
};
/**
 * @param {function} callback
 * @returns {string}
 */
const addCallback = callback => `${callbacks.push(callback) - 1}`;
//# sourceMappingURL=getCount.js.map
