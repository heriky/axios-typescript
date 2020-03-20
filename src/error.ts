import { AxiosRequestConfig, AxiosResponse } from "./typings";

class AxiosError extends Error {
    constructor(
        readonly message: string, 
        readonly config: AxiosRequestConfig,
        readonly code?: number,
        readonly request?: XMLHttpRequest,
        readonly response?: AxiosResponse<any>) {
        super(message);
        // Object.setPrototypeOf(this, new.target.prototype); // 注意这里
    }
}

export function createError(message: string, config: AxiosRequestConfig, code?: number, request?: XMLHttpRequest, response?: AxiosResponse<any>) {
    return new AxiosError(message, config, code, request, response);
}