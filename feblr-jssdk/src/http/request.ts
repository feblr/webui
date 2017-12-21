export type Result = 'success' | 'login' | 'error';
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

export class Http {
  private intercepts: Intercept[];

  constructor(private backend: HttpBackend) {
  }

  intercept<Params>(url: string, params: Params): [string, Params] {
    let _url: string = url;
    let _params: Params = params;

    this.intercepts.forEach((intercept) => {
      [_url, _params] = intercept(_url, _params);
    });

    return [_url, _params];
  }

  get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>> {
    let result = this.intercept(url, params);

    return this.backend.get(result[0], result[1]);
  }

  post<Params, Content>(url: string, params: any): PromiseLike<Response<Content>> {
    return this.backend.post(url, params);
  }
}
