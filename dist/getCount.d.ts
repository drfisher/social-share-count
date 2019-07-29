import * as T from "./types";
/**
 * Gets a count of shares from a social network
 * @param params
 * @propery params.networkName - type of social network
 * @propery params.url - url to check
 * @returns {Promise<number>}
 */
export declare const getCount: (params: T.IGetCountParams) => Promise<number>;
