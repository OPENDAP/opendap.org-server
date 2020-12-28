import { Observable } from 'rxjs';

import { MarkdownModel } from './models/markdown.model';

import path = require('path');
import fs = require('fs');

export class MarkdownModule {
    private faqPath = path.resolve(path.join('public', 'support', 'faq'));

    public getFaq(): Observable<Array<Array<MarkdownModel>>> {
        return new Observable(observer => {
            const files = fs.readdirSync(this.faqPath);
            const articles: any = {};

            for (const thisDir of files) {
                const faqTitle = thisDir.includes('_') ? thisDir.substring(3).replace('-', ' ') : thisDir;

                const thisFAQSection: Array<MarkdownModel> = [];

                for (const thisFAQ of fs.readdirSync(path.join(this.faqPath, thisDir))) {
                    const faqSection = fs.readFileSync(path.join(this.faqPath, thisDir, thisFAQ), 'utf8');
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
