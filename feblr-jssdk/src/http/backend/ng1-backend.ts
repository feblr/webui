import * as ng from 'angular';
import { Response, HttpBackend } from '../request';

class NgBackend implements HttpBackend {
  static $inject = ['$http'];

  constructor(private $http: ng.IHttpService) {
  }

  get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>> {
    return this.$http.get<Response<Content>>(url, params);
  }

  post<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>> {
    return this.$http.post<Response<Content>>(url, params);
  }
}
