"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asciidoc_1 = require("./src/modules/asciidoc");
var hyrax_1 = require("./src/modules/hyrax");
var markdown_1 = require("./src/modules/markdown");
var menu_builder_1 = require("./src/modules/menu-builder");
var express = require("express");
var http = require("http");
var path = require("path");
var app = express();
app.use(express.static(__dirname + '/website'));
app.use(express.static(__dirname + '/public'));
// AsciiDoc
var asciiDocModule = new asciidoc_1.AsciiDocModule();
var hyraxModule = new hyrax_1.HyraxModule();
var markdownModule = new markdown_1.MarkdownModule();
var menuModule = new menu_builder_1.MenuBuilder();
app.get('/api/menu', function (req, res) {
    res.status(200).send(menuModule.menu);
});
app.get('/api/adoc/:pageTitle', function (req, res) {
    asciiDocModule.getStandardArticle(req.params['pageTitle']).subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
// Legacy markdown
app.get('/api/content/faq', function (req, res) {
    markdownModule.getFaq().subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
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
// Hyrax Guide
app.get('/api/hyrax/guide', function (req, res) {
    hyraxModule.getGuide().subscribe(function (response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(error.errorCode).send(error);
    });
});
// Images
app.use('/images', express.static(path.resolve(path.join('public', 'images'))));
// app.get('/api/image/:imageName', (req, res) => {
//     hyraxModule.getGuide().subscribe(response => {
//       res.status(200).send(response);
//     }, error => {
//       res.status(error.errorCode).send(error);
//     });
// })
// Jira
// app.get('/api/jira/:issue', (req, res) => jira.getIssue(req, res));
// app.get('/api/jira/HK/versions', (req, res) => jira.getFixVersions(res));
// app.get('/api/jira/HK/versions/:fixVersionID', (req, res) => jira.getFixVersionByID(req, res));
// Routing
// app.get('', function (req, res) { return res.status(200).sendFile(path.join(__dirname, 'website', 'index.html')); });
app.all('*', function (req, res) { return res.status(200).sendFile(path.join(__dirname, 'website', 'index.html')); });
http.createServer(app).listen(process.env.PORT || 3001, function () {
    console.log("Server running on port " + (process.env.PORT || 3001) + ".");
});
