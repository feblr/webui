"use strict";
class NgBackend {
    constructor($http) {
        this.$http = $http;
    }
    get(url, params) {
        return this.$http.get(url, params);
    }
    post(url, params) {
        return this.$http.post(url, params);
    }
}
NgBackend.$inject = ['$http'];
//# sourceMappingURL=ng1-backend.js.map