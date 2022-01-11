"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownModel = void 0;
var showdown_1 = __importDefault(require("showdown"));
var MarkdownModel = /** @class */ (function () {
    /*
    * Processes a markdown file by splitting the title out of the document
    * and converting the body to HTML with showdown.
    * @param {string} md The markdown file to be processed.
    */
    function MarkdownModel(url, rawMd, id) {
        if (id === void 0) { id = 0; }
        this.converter = new showdown_1.default.Converter();
        this.url = url;
        console.log(url);
        var split = rawMd.split("\n")[0];
        var md = rawMd.substring(split.length + 3, rawMd.length);
        var tags = rawMd.split("##TAGS##");
        if (tags.length == 2) {
            md = tags[0].substring(split.length + 3, md.length);
            tags = tags[1].substr(2, tags[1].length).split(",");
        }
        else {
            tags = [];
        }
        this.title = split.substring(2, split.length - 1);
        ;
        this.md = this.converter.makeHtml(md);
        this.id = id;
        this.tags = tags;
    }
    return MarkdownModel;
}());
exports.MarkdownModel = MarkdownModel;
