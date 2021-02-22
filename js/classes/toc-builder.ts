import { Observable } from 'rxjs';

const jsdom = require("jsdom");

export class TocBuilderModule {
    public buildToc(guideHTML: string): Observable<any> {
        return new Observable(observer => {

            const { JSDOM } = jsdom;
            const dom = new JSDOM(guideHTML);


            const divs = dom.window.document.body;

            observer.next({ divs });
            observer.complete();
        });
    }
}