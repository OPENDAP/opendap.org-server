import { Observable } from 'rxjs';

import { MarkdownModel } from './models/markdown.model';

import path = require('path');
import fs = require('fs');

export class MarkdownModule {
    private sitePath = path.resolve(path.join('public', 'site'));
    private faqPath = path.resolve(path.join('public', 'support', 'faq'));

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

    public getFaqArticle(articleTitle: string): Observable<MarkdownModel> {
        return new Observable(observer => {
            let fileName = `${articleTitle}.md`;

            fs.readdir(this.faqPath, (err, files) => {
                if (err) {
                    observer.error({
                        'error': `Unable to load ${articleTitle}.`,
                        "errorCode": 404,
                        'error-text': err
                    });
                } else {
                    for (const thisDir of files) {
                        let faqSection = fs.readdirSync(path.join(this.faqPath, thisDir));
        
                        if (faqSection.includes(fileName)) {
                            let file = fs.readFileSync(path.join(this.faqPath, thisDir, fileName), 'utf8');
                            observer.next(new MarkdownModel(file));
                            break;
                        }
                    }

                    observer.unsubscribe();
                }
            });
        });
    }
}
