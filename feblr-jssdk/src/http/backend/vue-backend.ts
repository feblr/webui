import { Response, HttpBackend } from '../request';
import * as Vue from 'vue';
import 'vue-resource';

export class VueBackend implements HttpBackend {
  get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>> {
    return Vue.http.get(url, params).then(function(response: vuejs.HttpResponse) {
      let body = response.json() as Response<Content>;

      return body;
    }, function(response: vuejs.HttpResponse) {
      return response.json();
    });
  }

  post<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>> {
    return Vue.http.get(url, params).then(function(response: vuejs.HttpResponse) {
      let body = response.json() as Response<Content>;

      return body;
    }, function(response: vuejs.HttpResponse) {
      return response.json();
    });
  }
}
