"use strict";
class Dict {
    constructor(map, locale) {
        this.map = map;
        this.locale = locale;
    }
    translate(key, locale) {
        let _locale = locale ? locale : this.locale;
        let map = this.map[_locale];
        if (map) {
            return map[key];
        }
        else {
            return '';
        }
    }
}
exports.Dict = Dict;
//# sourceMappingURL=i18n.js.map