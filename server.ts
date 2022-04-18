import { AsciiDocModule } from './src/modules/asciidoc';
import { HyraxModule } from './src/modules/hyrax';
import { MarkdownModule } from './src/modules/markdown';
import { MenuBuilder } from './src/modules/menu-builder';

import express = require('express');
import http = require('http');
import path = require('path');

const app = express();
app.use(express.static(__dirname + '/website'));
app.use(express.static(__dirname + '/public'));

// AsciiDoc

const asciiDocModule = new AsciiDocModule();
const hyraxModule = new HyraxModule();
const markdownModule = new MarkdownModule();
const menuModule = new MenuBuilder();

app.get('/api/menu', (req, res) => {
    res.status(200).send(menuModule.menu);
});

app.get('/api/adoc/:pageTitle', (req, res) => {
    asciiDocModule.getStandardArticle(req.params['pageTitle']).subscribe(response => {
        res.status(200).send(response);
    }, error => {
        res.status(error.errorCode).send(error);
    });
});

// Legacy markdown

app.get('/api/content/faq', (req, res) => {
    markdownModule.getFaq().subscribe(response => {
        res.status(200).send(response)
    }, error => {
        res.status(error.errorCode).send(error);
    });
});
app.get('/api/content/faq/:articleTitle', (req, res) => {
    markdownModule.getFaqArticle(req.params['articleTitle']).subscribe(response => {
        res.status(200).send(response);
    }, error => {
        res.status(error.errorCode).send(error);
    });
});

// Hyrax

app.get('/api/versions', (req, res) => {
    hyraxModule.getAllVersions().subscribe(response => {
        res.status(200).send(response);
    }, error => {
        res.status(error.errorCode).send(error);
    })
});
app.get('/api/versions/latest', (req, res) => {
    hyraxModule.getVersion(-1).subscribe(response => {
        res.status(200).send(response);
    }, error => {
        res.status(error.errorCode).send(error);
    });
});
app.get('/api/versions/:version', (req, res) => {
    hyraxModule.getVersion(req.params['version']).subscribe(response => {
        res.status(200).send(response);
    }, error => {
        res.status(error.errorCode).send(error);
    });
});

// Hyrax Guide

app.get('/api/hyrax/guide', (req, res) => {
    hyraxModule.getGuide().subscribe(response => {
      res.status(200).send(response);
    }, error => {
      res.status(error.errorCode).send(error);
    });
})

// Images

app.use('/images', express.static(path.resolve(path.join('public', 'images'))));

// Public key

app.use('/security', express.static(path.resolve('public', 'security')));

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

http.createServer(app).listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}.`)
});
