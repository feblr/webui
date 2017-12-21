"use strict";
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
function isDefined(value) {
    return typeof value !== 'undefined';
}
exports.isDefined = isDefined;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
function isObject(value) {
    return typeof value !== null && value === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=types.js.map