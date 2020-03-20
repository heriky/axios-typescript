import { AxiosRequestConfig, PlainObj, Axios } from "./typings";
import { isPlainObject } from "./utils";

const defaultConfig: Partial<AxiosRequestConfig> = {
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },
    timeout: 0
}

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'];

ALLOWED_METHODS.forEach(method => {
    defaultConfig.headers![method] = {} // 输出headers: { common: {}, get: {}, post: {}, put: {} }
});

export function mergeConfig(defaults: Partial<AxiosRequestConfig>, config: AxiosRequestConfig) {
    const merged = deepMerge(defaults, config);
    const { method = 'get', headers = {} } = merged as AxiosRequestConfig;

    // 提取出method对应的headers， 并且删除各个方法名下的headers
    const methodHeaders = headers[method];
    ALLOWED_METHODS.forEach(method => delete merged[method]);
    const finalHeaders = { ...headers, ...methodHeaders };

    return { ...merged, headers: finalHeaders };
}

export function deepMerge(from: PlainObj<any>, to: PlainObj<any>) {
    Object.entries(from).forEach(([fromKey, fromValue]) => {

        // 目标中不存在，则直接赋值
        if (!(fromKey in to)) {
            to[fromKey] = fromValue;
            return;
        }

        // 存在，但是当前用于覆盖的值或者目标值有一个不是对象，则直接覆盖
        if (!isPlainObject(fromValue) || !isPlainObject(to[fromKey])) {
            return to[fromKey] = fromValue;
        }

        // 存在，用于覆盖的值，和目标值，都是对象，则进行深度合并。
        deepMerge(fromValue, to[fromKey]);
    });
    return to;
}

export default defaultConfig;