const path = require('path');
const fs = require('fs');
const showdown = require('showdown');
const converter = new showdown.Converter();

const sitePath = path.resolve(path.join('public', 'site'));
const faqPath = path.resolve(path.join('public', 'site', 'support', 'faq')); 

/**
 * Processes a markdown file by splitting the title out of the document
 * and converting the body to HTML with showdown.
 * @param {string} md The markdown file to be processed.
 */
function processMarkdownFile(md, id = 0) {
    let split = md.split("\n")[0];
    let title = split.substring(2, split.length - 1);
    let mds = md.substring(split.length + 3, md.length);
    let tags = md.split("##TAGS##");

    if (tags.length == 2) {
        mds = tags[0].substring(split.length + 3, md.length);;
        tags = tags[1].substr(2, tags[1].length).split(",");
    } else {
        tags = [];
    }

    return ({
        title: title,
        md: converter.makeHtml(mds),
        id: title.replace(/ /g, "-").toLowerCase(),
        tags: tags
    });
}

module.exports = {
    getPageByTitle: function (req, res) {
        const pageID = req.params['pageTitle'];

        if (pageID === 'faq') {
            let files = fs.readdirSync(faqPath);
            let toReturn = [];

            for (const thisDir of files) {
                let thisFAQSection = [];

                for (const thisFAQ of fs.readdirSync(path.join(faqPath, thisDir))) {
                    let faqSection = fs.readFileSync(path.join(faqPath, thisDir, thisFAQ), 'utf8');
                    thisFAQSection.push(processMarkdownFile(faqSection));
                }

                toReturn.push(thisFAQSection);
            }

            res.status(200).send(toReturn);
        } else {
            const confPath = path.join(sitePath, pageID, `${pageID}.config.json`);

            fs.exists(confPath, (exists) => {
                if (exists) {
                    fs.readFile(confPath, 'utf8', (err, data) => {
                        data = JSON.parse(data);

                        for (let section of data.sections) {
                            if (section.sectionType === "standard") {
                                section.parsedFile = processMarkdownFile(
                                    fs.readFileSync(path.join(data.root, section.filename), 'utf8'));
                            } else if (section.sectionType === "tabbed") {
                                for (let thisTab of section.tabs) {
                                    thisTab.parsedFile = processMarkdownFile(
                                        fs.readFileSync(path.join(data.root, thisTab.filename), 'utf8'));
                                }
                            }
                        }

                        res.status(200).send(data);
                    });
                } else {
                    res.status(404).send({
                        error: 'Configuration file not found.'
                    });
                }
            });
        }
    },
    getFaqArticle: function (req, res) {
        let fileName = `${req.params['articleTitle']}.md`;

        let files = fs.readdirSync(faqPath);

        for (const thisDir of files) {

            let faqSection = fs.readdirSync(path.join(faqPath, thisDir));

            if (faqSection.includes(fileName)) {
                let file = fs.readFileSync(path.join(faqPath, thisDir, fileName), 'utf8');
                res.status(200).send(processMarkdownFile(file));
            }
        }

        res.status(404).send("Not found");
    }
}