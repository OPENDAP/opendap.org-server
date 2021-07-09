"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TocNode = void 0;
var TocNode = /** @class */ (function () {
    function TocNode(level, id, text, children) {
        if (children === void 0) { children = new Array(); }
        this.level = level;
        this.id = id;
        this.text = text;
        this.children = children;
    }
    return TocNode;
}());
exports.TocNode = TocNode;
