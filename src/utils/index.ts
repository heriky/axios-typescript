import type { AxiosRequestConfig } from '../typings';

const toString = Object.prototype.toString;


export function isDate(val: unknown): val is Date {
    return val instanceof Date;
}

export function isPlainObject(val: unknown): val is object {
    return toString.call(val) === '[object Object]'
} 


function t(v: unknown): string {
    if (typeof v === 'string') {
        return encodeURI(v)
    }
    return v + ''
}

export function transformUrl(url: string, params?: any): string {

    if (!params) return url

    const rs = Object.entries(params).flatMap(([key, value]) => {
        if (value === null || value === undefined) return
        // 对象， 数组，日期
        return Array.isArray(value) 
            ? value.map(v => `${key}[]=${t(v)}`) 
            : isDate(value) 
            ? [`${key}=${value.toISOString()}`]
            : isPlainObject(value) 
            ? [`${key}=${JSON.stringify(value)}`]
            : [`${key}=${t(value)}`]
    })

    const searchParams = rs.join('&')

    return url.endsWith('?') ? `${url}${searchParams}` : `${url}?${searchParams}`;
    
}

export function transformRequestData(data: unknown): unknown {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}

function normalizeHeader(headers: NonNullable<AxiosRequestConfig['headers']>) {
    // content-type
    // contentType
    Object.entries(headers).forEach(([key, value]) => {
        const _headerName = key.replace(/-w/g, match => match.toUpperCase()).replace(/wW/, match => match.split('').join('-') );
        headers[_headerName] = value;
        delete headers[key];
    })
}

export function transformHeaders(headers: AxiosRequestConfig['headers'], data: unknown) {
    if (!headers) return;
    normalizeHeader(headers);
    if (isPlainObject(data)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json;charset=UTF-8';
    }
    return headers;
}


export function parseHeaderString(headerStr: string) {
    return headerStr.split('\n\r').reduce((acc, cur) => {
        const [k, v] = cur.split(':');
        return { [k]: v }
    }, {});
}
