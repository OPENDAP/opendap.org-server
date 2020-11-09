const asciidoctor = require('asciidoctor')();
const path = require('path');
const fs = require('fs');

const adocDir = path.resolve(path.join('public', 'adoc'));

module.exports = {
    getStandardArticle: function (req, res) {
        const pagePath = path.join(adocDir, `${req.params['pageTitle']}.adoc`);

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
}