"use strict";
class Http {
    constructor(backend) {
        this.backend = backend;
    }
    intercept(url, params) {
        let _url = url;
        let _params = params;
        this.intercepts.forEach((intercept) => {
            [_url, _params] = intercept(_url, _params);
        });
        return [_url, _params];
    }
    get(url, params) {
        let result = this.intercept(url, params);
        return this.backend.get(result[0], result[1]);
    }
    post(url, params) {
        return this.backend.post(url, params);
    }
}
exports.Http = Http;
//# sourceMappingURL=request.js.map