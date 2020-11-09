const asciidoctor = require('asciidoctor')();
const path = require('path');
const fs = require('fs');

const adocDir = path.resolve(path.join('public', 'adoc'));

function readAdocConf(res, pageTitle) {
    fs.readFile(path.join(adocDir, pageTitle, `${pageTitle}.conf.json`), 'utf8', (err, data) => {
        if (err) {
            res.status(404).send({
                'error': 'Unable to load page data',
                'error-text': err
            });
        } else {
            const conf = JSON.parse(data);

            if (conf.sections) {
                conf.sections.forEach(section => {
                    if (section.sectionType === 'standard') {
                        const file = fs.readFileSync(path.join(adocDir, pageTitle, section.filename), 'utf8');
                        section.parsedFile = asciidoctor.convert(file)
                    } else if(section.sectionType === 'tabbed') {
                        section.tabs.forEach(tab => {
                            const file = fs.readFileSync(path.join(adocDir, pageTitle, tab.filename), 'utf8');
                            tab.parsedFile = asciidoctor.convert(file)
                        });
                    }
                });

                res.status(200).send(conf);
            } else {
                res.status(404).send({
                    'error': 'Directory conf file invalid'
                });
            }
        }
    });
}

function readStandardAdoc(pagePath) {
    fs.readFile(pagePath, (err, data) => {
        if (err) {
            res.status(404).send({
                'error': 'Unable to load page data',
                'error-text': err
            });
        } else {
            const html = asciidoctor.convert(data);
            res.status(200).send({
                html
            });
        }
    });
}

module.exports = {
    getStandardArticle: function (req, res) {
        const confDriven = fs.lstatSync(path.join(adocDir, req.params['pageTitle'])).isDirectory();

        if (confDriven) {
            readAdocConf(res, req.params['pageTitle']);
        } else {
            readStandardAdoc(path.join(adocDir, `${req.params['pageTitle']}.adoc`));
        }
    }
}