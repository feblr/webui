"use strict";
const Vue = require("vue");
require("vue-resource");
class VueBackend {
    get(url, params) {
        return Vue.http.get(url, params).then(function (response) {
            let body = response.json();
            return body;
        }, function (response) {
            return response.json();
        });
    }
    post(url, params) {
        return Vue.http.get(url, params).then(function (response) {
            let body = response.json();
            return body;
        }, function (response) {
            return response.json();
        });
    }
}
exports.VueBackend = VueBackend;
//# sourceMappingURL=vue-backend.js.map