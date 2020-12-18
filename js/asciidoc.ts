import { Observable } from 'rxjs';

import path = require('path');
import fs = require('fs');

export class AsciiDocModule {

    private asciidoctor = require('asciidoctor')();
    private adocDir = path.resolve(path.join('public', 'adoc'));

    public getStandardArticle(pageTitle: string): Observable<string> {
        return new Observable((observer) => {
            const confDriven = fs.existsSync(path.join(this.adocDir, pageTitle));

            if (confDriven) {
                this.readAdocConf(pageTitle).subscribe(conf => {
                    observer.next(conf);
                }, error => {
                    observer.error(error);
                }, () => {
                    observer.unsubscribe();
                })
            } else {
                this.readStandardAdoc(path.join(this.adocDir, `${pageTitle}.adoc`)).subscribe(html => {
                    observer.next(html);
                }, error => {
                    observer.error(error);
                }, () => {
                    observer.unsubscribe();
                })
            }
        })
    }

    private readStandardAdoc(pagePath: any): Observable<string> {
        return new Observable((observer) => {
            fs.readFile(pagePath, (err, data) => {
                if (err) {
                    observer.error({
                        'error': 'Unable to load page data',
                        "errorCode": 404,
                        'error-text': err
                    });
                } else {
                    const html = this.asciidoctor.convert(data);
                    observer.next(html);
                    observer.unsubscribe();
                }
            });
        })
    }

    public readAdocConf(pageTitle: string): Observable<string> {
        return new Observable((observer) => {
            fs.readFile(path.join(this.adocDir, pageTitle, `${pageTitle}.conf.json`), 'utf8', (err, data) => {
                if (err) {
                    observer.error({
                        'error': 'Unable to load page data',
                        "errorCode": 404,
                        'error-text': err
                    });
                } else {
                    const conf = JSON.parse(data);
    
                    if (conf.sections) {
                        conf.sections.forEach((section: any) => {
                            if (section.sectionType === 'standard') {
                                const file = fs.readFileSync(path.join(this.adocDir, pageTitle, section.filename), 'utf8');
                                section.parsedFile = this.asciidoctor.convert(file)
                            } else if (section.sectionType === 'tabbed') {
                                section.tabs.forEach((tab: any) => {
                                    const file = fs.readFileSync(path.join(this.adocDir, pageTitle, tab.filename), 'utf8');
                                    tab.parsedFile = this.asciidoctor.convert(file)
                                });
                            }
                        });
    
                        observer.next(conf);
                    } else {
                        observer.error({
                            'error': 'Configuration file invalid.',
                            "errorCode": 500,
                        });
                    }
                }
            });
        });
    }
}
