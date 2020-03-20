import { Axios, AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosResponsePromise } from "./typings";

import xhr from './xhr';
import { InterceptorManager } from "./interceptor-manager";
import defaultConfig, { mergeConfig } from "./defaults";

interface InterceptorsMap { 
    request: InterceptorManager<AxiosRequestConfig>; 
    response: InterceptorManager<AxiosResponse<any>> 
};

// 一系列的resolve和reject
interface ChainType<T> {
    resolve(t: T): T | Promise<T> ;
    reject?(err?: unknown): unknown;
}

export class AxiosSelf implements Axios {

    private static instance: AxiosSelf;

    static getInstance() {
        return this.instance ?? (this.instance = new AxiosSelf())
    }

    interceptors: InterceptorsMap;
    
    defaults: Partial<AxiosRequestConfig>;

    private constructor() {
        // 不允许直接new.target

        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse<any>>()
        }

        this.defaults = defaultConfig;
    }

    request<T>(_config: AxiosRequestConfig) {
        // 合并config
        const config = mergeConfig(this.defaults, _config);

        // 将请求拦截器，请求，响应拦截器，三种类型串联起来
        const chain: ChainType<AxiosRequestConfig | AxiosResponse<T>>[] = [{ 
            resolve: xhr
        }];

        // request拦截器，后添加，先执行
        this.interceptors.request.each(inter => {
            chain.unshift(inter)
        })

        //response拦截器，后添加，后执行
        this.interceptors.response.each(inter => {
            chain.push(inter);
        })

        let promise: Promise<any> = Promise.resolve(config);
        while(chain.length) {
            const { resolve, reject } = chain.shift()!;
            // ** 重点看这里：这里是【链式】注册，然后异步依次展开
            // 提前声明一系列的resolve和reject函数，后面依次执行

            promise = promise.then(resolve, reject);
        }

        return promise;
    }

    requestWithoutData<T>(method: string, url: string, config = {}) {
        const finalConfig = { method, url, ...config };
        return this.request<T>(finalConfig);
    }

    requestWithData<T>(method: string, url: string, data = {}, config = {}) {
        const finalConfig = { method, url, data, ...config };
        return this.request<T>(finalConfig);
    }

    get<T>(url: string, config = {}) {
        return this.requestWithoutData<T>('get', url, config);
    }

    post<T>(url: string, data = {}, config = {}) {
        return this.requestWithData<T>('post', url, data, config);
    }

    put<T>(url: string, data = {}, config = {}) {
        return this.requestWithData<T>('put', url, data, config);
    }

    delete<T>(url: string, config = {}) {
        return this.requestWithoutData<T>('delete', url, config);
    }

}

export function createAxiosInstance() {
    const _axios = AxiosSelf.getInstance();
    const instance = _axios.request;
    return Object.assign({}, instance, _axios);
}
