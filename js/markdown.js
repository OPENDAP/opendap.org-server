"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownModule = void 0;
var rxjs_1 = require("rxjs");
var markdown_model_1 = require("./models/markdown.model");
var path = require("path");
var fs = require("fs");
var MarkdownModule = /** @class */ (function () {
    function MarkdownModule() {
        this.sitePath = path.resolve(path.join('public', 'site'));
        this.faqPath = path.resolve(path.join('public', 'support', 'faq'));
    }
    // public getPageByTitle(req, res) {
    //     const pageID = req.params['pageTitle'];
    //     if (pageID === 'faq') {
    //         let files = fs.readdirSync(this.faqPath);
    //         let toReturn = [];
    //         for (const thisDir of files) {
    //             let thisFAQSection = [];
    //             for (const thisFAQ of fs.readdirSync(path.join(faqPath, thisDir))) {
    //                 let faqSection = fs.readFileSync(path.join(faqPath, thisDir, thisFAQ), 'utf8');
    //                 thisFAQSection.push(new MarkdownModel(faqSection));
    //             }
    //             toReturn.push(thisFAQSection);
    //         }
    //         res.status(200).send(toReturn);
    //     } else {
    //         const confPath = path.join(this.sitePath, pageID, `${pageID}.config.json`);
    //         const exists = fs.existsSync(confPath);
    //         if (exists) {
    //             fs.readFile(confPath, 'utf8', (err, data) => {
    //                 data = JSON.parse(data);
    //                 for (let section of data.sections) {
    //                     if (section.sectionType === "standard") {
    //                         section.parsedFile = new MarkdownModel(
    //                             fs.readFileSync(path.join(data.root, section.filename), 'utf8'));
    //                     } else if (section.sectionType === "tabbed") {
    //                         for (let thisTab of section.tabs) {
    //                             thisTab.parsedFile = new MarkdownModel(
    //                                 fs.readFileSync(path.join(data.root, thisTab.filename), 'utf8'));
    //                         }
    //                     }
    //                 }
    //                 res.status(200).send(data);
    //             });
    //         } else {
    //             res.status(404).send({
    //                 error: 'Configuration file not found.'
    //             });
    //         }
    //     }
    // }
    MarkdownModule.prototype.getFaqArticle = function (articleTitle) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var fileName = articleTitle + ".md";
            fs.readdir(_this.faqPath, function (err, files) {
                if (err) {
                    observer.error({
                        'error': "Unable to load " + articleTitle + ".",
                        "errorCode": 404,
                        'error-text': err
                    });
                }
                else {
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var thisDir = files_1[_i];
                        var faqSection = fs.readdirSync(path.join(_this.faqPath, thisDir));
                        if (faqSection.includes(fileName)) {
                            var file = fs.readFileSync(path.join(_this.faqPath, thisDir, fileName), 'utf8');
                            observer.next(new markdown_model_1.MarkdownModel(file));
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
