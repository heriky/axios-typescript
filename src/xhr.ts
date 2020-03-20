import type { AxiosRequestConfig, AxiosResponsePromise } from './typings'
import { parseHeaderString } from './utils';
import { createError } from './error';
import { transformUrl, transformRequestData, transformHeaders } from './utils';

function processConfig(config: AxiosRequestConfig) {
    config.url = transformUrl(config.url);
    config.data = transformRequestData(config.data);
    config.headers = transformHeaders(config.headers, config.data);
    return config;
}

export default function<T> (rawConfig: AxiosRequestConfig): AxiosResponsePromise<T> {
    const config = processConfig(rawConfig);
    const { url, method = 'GET', data, headers = {}, responseType, ...rest } = config

    const xhr = new XMLHttpRequest();
    Object.assign(xhr, rest); // 额外配置timeout, withCredentials

    xhr.open(method, url);
    Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
    });

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = e => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                let resData = responseType === 'text' ? xhr.responseType : xhr.response;
                try {
                    resData = JSON.parse(resData); // 尝试解析，解析不了也没关系
                } catch {
                    
                }

                if (xhr.status > 299 || xhr.status < 200) {
                    reject(Error(`error code${xhr.status}`));
                }

                resolve({
                    data: resData,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaderString(xhr.getAllResponseHeaders()),
                    request: config
                });
            }
        }

        xhr.onerror = () => reject(createError('network error', config));
        xhr.ontimeout = () => reject(createError('timeout error', config));
        xhr.send(data); 
    });
}