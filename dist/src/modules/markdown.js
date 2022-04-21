"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownModule = void 0;
var rxjs_1 = require("rxjs");
var markdown_model_1 = require("../models/markdown.model");
var utils_1 = require("../classes/utils");
var path = require("path");
var fs = require("fs");
var MarkdownModule = /** @class */ (function () {
    function MarkdownModule() {
    }
    MarkdownModule.prototype.getFaq = function () {
        return new rxjs_1.Observable(function (observer) {
            var files = fs.readdirSync(utils_1.Links.faq);
            var articles = {};
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var thisDir = files_1[_i];
                var faqTitle = thisDir.includes('_') ? thisDir.substring(3).replace('-', ' ') : thisDir;
                var thisFAQSection = [];
                for (var _a = 0, _b = fs.readdirSync(path.join(utils_1.Links.faq, thisDir)); _a < _b.length; _a++) {
                    var thisFAQ = _b[_a];
                    var faqSection = fs.readFileSync(path.join(utils_1.Links.faq, thisDir, thisFAQ), 'utf8');
                    thisFAQSection.push(new markdown_model_1.MarkdownModel(thisFAQ.substring(0, thisFAQ.length - 3), faqSection));
                }
                articles[faqTitle] = thisFAQSection;
            }
            observer.next(articles);
            observer.complete();
        });
    };
    MarkdownModule.prototype.getFaqArticle = function (articleTitle) {
        return new rxjs_1.Observable(function (observer) {
            var fileName = articleTitle + ".md";
            fs.readdir(utils_1.Links.faq, function (err, files) {
                if (err) {
                    observer.error({
                        'error': "Unable to load " + articleTitle + ".",
                        "errorCode": 404,
                        'error-text': err
                    });
                }
                else {
                    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                        var thisDir = files_2[_i];
                        var faqSection = fs.readdirSync(path.join(utils_1.Links.faq, thisDir));
                        if (faqSection.includes(fileName)) {
                            var file = fs.readFileSync(path.join(utils_1.Links.faq, thisDir, fileName), 'utf8');
                            observer.next(new markdown_model_1.MarkdownModel(articleTitle, file));
                            break;
                        }
                    }
                    observer.unsubscribe();
                }
            });
        });
    };
    return MarkdownModule;
}());
exports.MarkdownModule = MarkdownModule;
