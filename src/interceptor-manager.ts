
export interface Interceptor<T> {
    resolve: (t: T) => T;
    reject?: (err?: unknown) => Promise<unknown>;
}

// 请求拦截器的管理类
// 响应拦截器的管理类
// T表示，这到底是一个请求拦截器类型，还是一个响应拦截器类型
export class InterceptorManager<T> {

    private interceptors: (Interceptor<T> | null) [] = [];

    use(interceptor: Interceptor<T>): number {
        this.interceptors.push(interceptor); 
        const id = this.interceptors.length - 1;
        return id;
    }

    eject(id: number) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null; // 不能直接移除，否则位置和id对应会错乱
        }
    }

    each(callback: (item: Interceptor<T>) => void) {
        this.interceptors.forEach(inter => {
            if (!inter) return;
            callback(inter);
        })
    }

}