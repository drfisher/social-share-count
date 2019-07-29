import { IKeyValue } from "./types";
import { addUrlParams } from "./urlTools";

const JSONP_REJECT_TIMEOUT: number = 10000;

const cache: { callbackNames: IKeyValue; data: IKeyValue } = {
  callbackNames: {},
  data: {}
};

/**
 * Loads a resource
 * @param {string} url
 * @returns {Promise<any>}
 */
const request = (url: string): Promise<any> => {
  const { data } = cache;
  return data[url] ? Promise.resolve(data[url]) : jsonpRequest(url);
};

/**
 * Creates a jsonp request
 * @param url
 * @returns {Promise<any>}
 */
const jsonpRequest = (url: string): Promise<any> =>
  new Promise((resolve, reject) => {
    const callbackName = createCallbackName();
    const scriptSrc = addUrlParams(url, { callbackName });
    let rejectTimeout: number;

    // Callback function
    (window as any)[callbackName] = (data: any) => {
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
const clearAfterJsonp = (
  script: HTMLScriptElement,
  callbackName: string
): void => {
  document.head.removeChild(script);
  delete (window as any)[callbackName];
};

/**
 * @returns {string} a uniq callback name
 */
const createCallbackName = (): string => {
  let callbackName: string;
  do {
    callbackName = `jsonp_${(Math.random() + "").split(".")[1]}`;
  } while (callbackName in cache.callbackNames || callbackName in window);

  cache.callbackNames[callbackName] = 1;
  return callbackName;
};

export default request;
