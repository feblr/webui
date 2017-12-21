export declare type Result = 'success' | 'login' | 'error';
export interface Response<T> {
    result: Result;
    content: T;
    errors: string[];
    message: string;
    code: number;
}
export interface Intercept {
    (url: string, params: any): [string, any];
}
export interface HttpBackend {
    get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>>;
    post<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>>;
}
export declare class Http {
    private backend;
    private intercepts;
    constructor(backend: HttpBackend);
    intercept<Params>(url: string, params: Params): [string, Params];
    get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>>;
    post<Params, Content>(url: string, params: any): PromiseLike<Response<Content>>;
}
