import { Observable } from 'rxjs';

import { MarkdownModel } from '../models/markdown.model';
import { Links } from '../classes/utils';

import path = require('path');
import fs = require('fs');

export class MarkdownModule {
    public getFaq(): Observable<Array<Array<MarkdownModel>>> {
        return new Observable(observer => {
            const files = fs.readdirSync(Links.faq);
            const articles: any = {};

            for (const thisDir of files) {
                const faqTitle = thisDir.includes('_') ? thisDir.substring(3).replace('-', ' ') : thisDir;

                const thisFAQSection: Array<MarkdownModel> = [];

                for (const thisFAQ of fs.readdirSync(path.join(Links.faq, thisDir))) {
                    const faqSection = fs.readFileSync(path.join(Links.faq, thisDir, thisFAQ), 'utf8');
                    thisFAQSection.push(new MarkdownModel(thisFAQ.substring(0, thisFAQ.length - 3), faqSection));
                }

                articles[faqTitle] = thisFAQSection;
            }

            observer.next(articles);
            observer.complete();
        })
    }

    public getFaqArticle(articleTitle: string): Observable<MarkdownModel> {
        return new Observable(observer => {
            let fileName = `${articleTitle}.md`;

            fs.readdir(Links.faq, (err, files) => {
                if (err) {
                    observer.error({
                        'error': `Unable to load ${articleTitle}.`,
                        "errorCode": 404,
                        'error-text': err
                    });
                } else {
                    for (const thisDir of files) {
                        let faqSection = fs.readdirSync(path.join(Links.faq, thisDir));
        
                        if (faqSection.includes(fileName)) {
                            let file = fs.readFileSync(path.join(Links.faq, thisDir, fileName), 'utf8');
                            observer.next(new MarkdownModel(articleTitle, file));
                            break;
                        }
                    }

                    observer.unsubscribe();
                }
            });
        });
    }
}
