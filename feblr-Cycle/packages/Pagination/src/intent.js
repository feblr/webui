"use strict";
var xstream_1 = require("xstream");
function intent(sources) {
    var prevPage$ = sources.dom.select('.prev button')
        .events('click')
        .map(function (evt) {
        return { kind: 'PrevPage' };
    });
    var nextPage$ = sources.dom.select('.next button')
        .events('click')
        .map(function (evt) {
        return { kind: 'NextPage' };
    });
    var gotoPage$ = sources.dom.select('.page button')
        .events('click')
        .map(function (evt) {
        return { kind: 'GotoPage', number: parseInt(evt.target.textContent) };
    });
    return xstream_1["default"].merge(prevPage$, nextPage$, gotoPage$);
}
exports.__esModule = true;
exports["default"] = intent;
