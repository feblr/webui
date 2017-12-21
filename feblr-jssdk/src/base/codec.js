"use strict";
function encode(obj) {
    let parts = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    return parts.join('&');
}
exports.encode = encode;
function decode(str) {
    let obj = {};
    let parts = str.split('&');
    for (let index in parts) {
        let part = parts[index];
        let kv = part.split('=');
        let key = decodeURIComponent(kv[0]);
        let value = decodeURIComponent(kv[1]);
        obj[key] = value;
    }
    return obj;
}
exports.decode = decode;
//# sourceMappingURL=codec.js.map