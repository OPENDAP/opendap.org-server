import { Observable } from 'rxjs';

import { FileTooling, Links } from '../classes/utils';

import path = require('path');
import fs = require('fs');

const asciidoctor = require('asciidoctor')();

export enum DocTypes {
  standard = "standard",
  tabbed = "tabbed",
  gallery = "gallery",
  html = "html",
  cards = "cards"
}

export class AsciiDocModule {
  public getStandardArticle(pageTitle: string): Observable<any> {
    return new Observable((observer) => {
      const confDriven = fs.existsSync(path.resolve(Links.pages));
      if (confDriven) {
        this.readAdocConf(pageTitle).subscribe(conf => {
          observer.next(conf);
        }, error => {
          observer.error(error);
        }, () => {
          observer.unsubscribe();
        })
      } else {
        this.readStandardAdoc(path.resolve(Links.pages, `${pageTitle}.adoc`)).subscribe(html => {
          observer.next({ html });
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
          const html = asciidoctor.convert(data);
          observer.next(html);
          observer.unsubscribe();
        }
      });
    })
  }

  public readAdocConf(pageTitle: string): Observable<string> {
    return new Observable((observer) => {
      fs.readFile(path.resolve(Links.pages, pageTitle, `${pageTitle}.conf.json`), 'utf8', (err, data) => {
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
              this._processSection(section, pageTitle);
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

  private _processSection(section: any, pageTitle: string) {
    let file;

    switch (section.sectionType) {
      case (DocTypes.standard):
        file = fs.readFileSync(path.resolve(Links.pages, pageTitle, section.filename), 'utf8');
        section.parsedFile = asciidoctor.convert(file);
        section.parsedFile = this._createRefs(section.parsedFile, pageTitle);
        break;
      case (DocTypes.tabbed):
        section.tabs.forEach((tab: any) => {
          const file = fs.readFileSync(path.resolve(Links.pages, pageTitle, tab.filename), 'utf8');
          tab.parsedFile = asciidoctor.convert(file);
          tab.parsedFile = this._createRefs(tab.parsedFile, pageTitle);
        });
        break;
      case (DocTypes.gallery):
        section.parsedFile = JSON.parse(fs.readFileSync(path.resolve(Links.pages, pageTitle, section.filename), 'utf8'));
        break;
      case (DocTypes.cards):
        section.parsedFile = JSON.parse(fs.readFileSync(path.resolve(Links.pages, pageTitle, section.filename), 'utf8'));
        break;
      case (DocTypes.html):
        section.parsedFile = fs.readFileSync(path.resolve(Links.pages, pageTitle, section.filename), 'utf8');
    }
  }

  private _createRefs(section: string, pageTitle: string) {
    if (section.includes('sectionType')) {
      const ref = section.split(/{{([^\)]+)}}/g);

      let toReturn = '';
      ref.forEach((innerSection: string) => {
        if (innerSection.includes('sectionType')) {
          const parsed = JSON.parse(`{${innerSection}}`);
          this._processSection(parsed, pageTitle);
          toReturn += parsed.parsedFile;
        } else {
          toReturn += innerSection;
        }
      });

      return toReturn;
    }

    return section;
  }
}
