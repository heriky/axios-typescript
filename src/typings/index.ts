export type RequestMethod = 
    | 'get' | 'GET'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'delete' | 'DELETE'
    | 'option' | 'OPTION'
    | 'patch' | 'PATCH';

export interface AxiosRequestConfig {
    method?: string;
    url: string;
    data?: any;
    params?: any;
    headers?: PlainObj<any>;
    responseType?: string;
    timeout?: number;
    withCredentials?: boolean;
    [key: string]: unknown
}

export interface PlainObj<T> {
    [key: string]: T
}

export type AxiosResponsePromise<T> = Promise<AxiosResponse<T>>;

export interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    request: AxiosRequestConfig;
    headers: PlainObj<string>;
}


export interface Axios {
    request<T>(config: AxiosRequestConfig): AxiosResponsePromise<T>,
    get<T>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'data'>): AxiosResponsePromise<T>,
    post<T>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'data'>): AxiosResponsePromise<T>,
    put<T>(url?: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'data'>): AxiosResponsePromise<T>,
}

export interface AxiosInstance<T> extends Axios {
    (config: AxiosRequestConfig): AxiosResponsePromise<T>,
}