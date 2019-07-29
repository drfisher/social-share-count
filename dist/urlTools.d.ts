import { IKeyValue } from "./types";
/**
 * Adds a GET param to an url
 * @param {string} url
 * @param {object} params - key/value list of params
 */
export declare const addUrlParams: (
  url: string,
  params?: IKeyValue | undefined
) => string;
