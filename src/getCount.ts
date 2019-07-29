import request from "./request";
import * as T from "./types";
import { addUrlParams } from "./urlTools";

/**
 * Callback wrapper for some networks
 * @param id - callback id
 * @param count
 */
const execCountCallback = (id: number, count: number): void => {
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
(window as any).VK = {
  Share: {
    count: execCountCallback
  }
};
(window as any).ODKL = {
  updateCount: execCountCallback
};
const callbacks: any[] = [];

const networkParams: T.ISocialNetworkConfigLib = {
  facebook: {
    getCount(data): number {
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
export const getCount = (params: T.IGetCountParams): Promise<number> => {
  const typeParams = networkParams[params.networkName];
  const requestParams = {
    [typeParams.params.url]: params.url
  };

  return typeParams.getCount
    ? request(addUrlParams(typeParams.url, requestParams)).then(data =>
        typeParams.getCount ? typeParams.getCount(data) : 0
      )
    : new Promise((resolve, reject) => {
        requestParams[typeParams.params.id || 0] = addCallback(resolve);
        request(addUrlParams(typeParams.url, requestParams)).catch(reject);
      });
};

/**
 * @param {function} callback
 * @returns {string}
 */
const addCallback = (callback: () => any): string =>
  `${callbacks.push(callback) - 1}`;
