"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsciiDocModule = void 0;
var rxjs_1 = require("rxjs");
var utils_1 = require("../classes/utils");
var path = require("path");
var fs = require("fs");
var asciidoctor = require('asciidoctor')();
var AsciiDocModule = /** @class */ (function () {
    function AsciiDocModule() {
    }
    AsciiDocModule.prototype.getStandardArticle = function (pageTitle) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var confDriven = fs.existsSync(path.resolve(utils_1.Links.pages));
            if (confDriven) {
                _this.readAdocConf(pageTitle).subscribe(function (conf) {
                    observer.next(conf);
                }, function (error) {
                    observer.error(error);
                }, function () {
                    observer.unsubscribe();
                });
            }
            else {
                _this.readStandardAdoc(path.resolve(utils_1.Links.pages, pageTitle + ".adoc")).subscribe(function (html) {
                    observer.next({ html: html });
                }, function (error) {
                    observer.error(error);
                }, function () {
                    observer.unsubscribe();
                });
            }
        });
    };
    AsciiDocModule.prototype.readStandardAdoc = function (pagePath) {
        return new rxjs_1.Observable(function (observer) {
            fs.readFile(pagePath, function (err, data) {
                if (err) {
                    observer.error({
                        'error': 'Unable to load page data',
                        "errorCode": 404,
                        'error-text': err
                    });
                }
                else {
                    var html = asciidoctor.convert(data);
                    observer.next(html);
                    observer.unsubscribe();
                }
            });
        });
    };
    AsciiDocModule.prototype.readAdocConf = function (pageTitle) {
        return new rxjs_1.Observable(function (observer) {
            fs.readFile(path.resolve(utils_1.Links.pages, pageTitle, pageTitle + ".conf.json"), 'utf8', function (err, data) {
                if (err) {
                    observer.error({
                        'error': 'Unable to load page data',
                        "errorCode": 404,
                        'error-text': err
                    });
                }
                else {
                    var conf = JSON.parse(data);
                    if (conf.sections) {
                        conf.sections.forEach(function (section) {
                            var file;
                            switch (section.sectionType) {
                                case ('standard'):
                                    file = fs.readFileSync(path.resolve(utils_1.Links.pages, pageTitle, section.filename), 'utf8');
                                    section.parsedFile = asciidoctor.convert(file);
                                    break;
                                case ('tabbed'):
                                    section.tabs.forEach(function (tab) {
                                        var file = fs.readFileSync(path.resolve(utils_1.Links.pages, pageTitle, tab.filename), 'utf8');
                                        tab.parsedFile = asciidoctor.convert(file);
                                    });
                                    break;
                                case ('gallery'):
                                    section.parsedFile = JSON.parse(fs.readFileSync(path.resolve(utils_1.Links.pages, pageTitle, section.filename), 'utf8'));
                                    break;
                            }
                        });
                        observer.next(conf);
                    }
                    else {
                        observer.error({
                            'error': 'Configuration file invalid.',
                            "errorCode": 500,
                        });
                    }
                }
            });
        });
    };
    return AsciiDocModule;
}());
exports.AsciiDocModule = AsciiDocModule;
