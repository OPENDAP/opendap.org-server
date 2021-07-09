"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TocBuilderModule = void 0;
var rxjs_1 = require("rxjs");
var jsdom = require("jsdom");
var TocBuilderModule = /** @class */ (function () {
    function TocBuilderModule() {
    }
    TocBuilderModule.prototype.buildToc = function (guideHTML) {
        return new rxjs_1.Observable(function (observer) {
            var JSDOM = jsdom.JSDOM;
            var dom = new JSDOM(guideHTML);
            var divs = dom.window.document.body;
            observer.next({ divs: divs });
            observer.complete();
        });
    };
    return TocBuilderModule;
}());
exports.TocBuilderModule = TocBuilderModule;
