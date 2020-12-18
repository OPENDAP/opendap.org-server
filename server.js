"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asciidoc_1 = require("./js/asciidoc");
var hyrax_1 = require("./js/hyrax");
var markdown_1 = require("./js/markdown");
var express = require("express");
var http = require("http");
var path = require("path");
// const jira = require('./js/jira');
// const hyrax = require('./js/hyrax');
// const markdown = require('./js/markdown');
var app = express();
app.use(express.static(__dirname + '/dist/website'));
app.use(express.static(__dirname + '/public'));
// AsciiDoc
var asciiDocModule = new asciidoc_1.AsciiDocModule();
var hyraxModule = new hyrax_1.HyraxModule();
var markdownModule = new markdown_1.MarkdownModule();
app.get('/api/adoc/:pageTitle', function (req, res) {
    asciiDocModule.getStandardArticle(req.params['pageTitle']).subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
// Legacy markdown
// app.get('/api/content/:pageTitle', (req, res) => markdown.getPageByTitle(req, res));
app.get('/api/content/faq/:articleTitle', function (req, res) {
    markdownModule.getFaqArticle(req.params['articleTitle']).subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
// Hyrax
app.get('/api/versions', function (req, res) {
    hyraxModule.getAllVersions().subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
app.get('/api/versions/latest', function (req, res) {
    hyraxModule.getVersion(-1).subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
app.get('/api/versions/:version', function (req, res) {
    hyraxModule.getVersion(req.params['version']).subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
// Jira
// app.get('/api/jira/:issue', (req, res) => jira.getIssue(req, res));
// app.get('/api/jira/HK/versions', (req, res) => jira.getFixVersions(res));
// app.get('/api/jira/HK/versions/:fixVersionID', (req, res) => jira.getFixVersionByID(req, res));
// Routing
app.get('', function (req, res) { return res.sendFile(path.resolve('./dist/website/index.html')); });
app.all('*', function (req, res) { return res.status(200).sendFile(path.resolve('./dist/website/index.html')); });
http.createServer(app).listen(process.env.PORT || 3001, function () {
    console.log("Server running on port " + (process.env.PORT || 3001) + ".");
});
