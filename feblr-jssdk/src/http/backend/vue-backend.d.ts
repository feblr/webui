import { Response, HttpBackend } from '../request';
import 'vue-resource';
export declare class VueBackend implements HttpBackend {
    get<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>>;
    post<Params, Content>(url: string, params: Params): PromiseLike<Response<Content>>;
}
