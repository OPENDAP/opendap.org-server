"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBuilder = void 0;
var utils_1 = require("../classes/utils");
var path = require("path");
var fs = require("fs");
var MenuBuilder = /** @class */ (function () {
    function MenuBuilder() {
        this.menu = [];
        this.menu = JSON.parse(fs.readFileSync(path.resolve(utils_1.Links.contentRoot, 'menu.conf.json'), 'utf-8')).menu;
    }
    return MenuBuilder;
}());
exports.MenuBuilder = MenuBuilder;
