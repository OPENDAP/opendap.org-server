import { Observable } from 'rxjs';

import { AllVersionFiles } from './models/hyrax-version.model';
import { HyraxVersionList } from './models/hyrax-version-list.model';

import fs = require('fs');
import path = require('path');
import jsdom = require('jsdom');

export class HyraxModule {

    private hyraxDir = path.resolve(path.join('public', 'Hyrax'));

    /**
     * Returns a specific version of Hyrax data from the server.
     * @param {string} requestedVersion The version that the api will serve.
     * @param {response} res The response that will serve the data.
     */
    private getSpecificVersion(requestedVersion: string): Observable<any> {
        return new Observable(observer => {
            const versionPath = path.join(this.hyraxDir, requestedVersion);

            fs.readdir(versionPath, (err, files) => {
                if (err) {
                    observer.error({
                        'error': 'Unable to load Hyrax version information.',
                        "errorCode": 404,
                        'error-text': err
                    });
                } else {
                    const allVersionFiles = new AllVersionFiles(requestedVersion);

                    for (let file of files) {
                        let thisFile: string = fs.readFileSync(path.join(this.hyraxDir, requestedVersion, file), 'utf8');

                        if (file.includes("download")) {
                            let sections = thisFile.split("#SPLIT#");
                            sections.shift();

                            allVersionFiles.download = sections;
                        } else if (file.includes("installation")) {
                            allVersionFiles.installation = thisFile;
                        } else {
                            allVersionFiles.versions.push(JSON.parse(thisFile));
                        }
                    }

                    observer.next(allVersionFiles);
                    observer.complete();
                }
            });
        });
    }

    public getAllVersions(): Observable<HyraxVersionList> {
        return new Observable(observer => {
            fs.readdir(this.hyraxDir, (err, files) => {
                if (err) {
                    observer.error({
                        'error': 'Unable to get Hyrax versions.',
                        'errorCode': 404,
                        'error-text': err
                    });
                } else {
                    observer.next({
                        versions: files
                    });
                }
            });
        })
    }

    /** @todo all stuff should be parsed server-side */
    public getVersion(version: number | string): Observable<any> {
        return new Observable(observer => {
            fs.readdir(this.hyraxDir, (err, files) => {
                if (err) {
                    observer.error({
                        'error': `Unable to read ${version === -1 ? 'latest' : ''} Hyrax version.`,
                        'errorCode': 404,
                        'error-text': err
                    });
                } else {
                    const hyraxVersion = version === -1 ? files.sort()[files.length - 1] : `${version}`;

                    this.getSpecificVersion(`${hyraxVersion}`).subscribe(response => {
                        observer.next(response);
                    }, error => {
                        observer.error({
                            'error': `Unable to read ${version === -1 ? 'latest' : ''} Hyrax version.`,
                            'errorCode': 404,
                            'error-text': error
                        });
                    });
                }
            });
        });
    }

    public getGuide(): Observable<any> {
        const hyraxGuide = path.resolve(path.join('hyrax_guide', 'Master_Hyrax_Guide.html'));

        return new Observable(observer => {
            fs.readFile(hyraxGuide, 'utf8', (error, data) => {
                if (error) {
                    observer.error({
                        'error': `Unable to read Hyrax guide.`,
                        'errorCode': 404,
                        'error-text': error
                    })
                } else {
                    observer.next({data});
                    observer.complete();
                }
            });
        });
    }
}
