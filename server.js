const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const jira = require('./js/jira');
const hyrax = require('./js/hyrax');
const asciidoc = require('./js/asciidoc');
const markdown = require('./js/markdown');

const app = express();
app.use(express.static(__dirname + '/dist/website'));
app.use(express.static(__dirname + '/public'));

// AsciiDoc

app.get('/api/adoc/:pageTitle', (req, res) => asciidoc.getStandardArticle(req, res));

// Legacy markdown

app.get('/api/content/:pageTitle', (req, res) => markdown.getPageByTitle(req, res));
app.get('/api/content/faq/:articleTitle', (req, res) => markdown.getFaqArticle(req, res));

// Hyrax

app.get('/api/versions', (req, res) => hyrax.getAllVersions(res));
app.get('/api/versions/latest', (req, res) => hyrax.getLatestVersion(req, res));
app.get('/api/versions/:version', (req, res) => hyrax.getVersion(req, res));

// Jira

app.get('/api/jira/:issue', (req, res) => jira.getIssue(req, res));
app.get('/api/jira/HK/versions', (req, res) => jira.getFixVersions(res));
app.get('/api/jira/HK/versions/:fixVersionID', (req, res) => jira.getFixVersionByID(req, res));

// Routing

app.get('', (req, res) => res.sendFile(path.resolve('./dist/website/index.html')));
app.all('*', (req, res) => res.status(200).sendFile(path.resolve('./dist/website/index.html')));

http.createServer(app).listen(3001, () => {
    console.log('Server running on port 3001.')
});
