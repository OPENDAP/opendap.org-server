"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTooling = exports.Links = void 0;
var path = require("path");
var fs = require("fs");
var Links = /** @class */ (function () {
    function Links() {
    }
    Links.contentRoot = path.resolve('public/content');
    Links.pages = path.resolve(Links.contentRoot, 'adoc');
    Links.faq = path.resolve(Links.contentRoot, 'faq');
    Links.hyrax = path.resolve(Links.contentRoot, 'hyrax');
    return Links;
}());
exports.Links = Links;
var FileTooling = /** @class */ (function () {
    function FileTooling() {
    }
    FileTooling.existsSyncLazy = function (_path, substrFrom, substrLength) {
        try {
            if (substrFrom) {
                var files = fs.readdirSync(_path);
                files.forEach(function (file) {
                    var lazyPath = path.resolve(_path, file.substring(substrFrom, substrLength));
                    console.log(lazyPath);
                });
            }
            else {
                return fs.existsSync(_path);
            }
        }
        catch (error) {
            throw error;
        }
    };
    return FileTooling;
}());
exports.FileTooling = FileTooling;
