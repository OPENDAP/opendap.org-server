"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyraxModule = void 0;
var rxjs_1 = require("rxjs");
var hyrax_version_model_1 = require("./models/hyrax-version.model");
var fs = require("fs");
var path = require("path");
var HyraxModule = /** @class */ (function () {
    function HyraxModule() {
        this.hyraxDir = path.resolve(path.join('public', 'Hyrax'));
    }
    /**
     * Returns a specific version of Hyrax data from the server.
     * @param {string} requestedVersion The version that the api will serve.
     * @param {response} res The response that will serve the data.
     */
    HyraxModule.prototype.getSpecificVersion = function (requestedVersion) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var versionPath = path.join(_this.hyraxDir, requestedVersion);
            fs.readdir(versionPath, function (err, files) {
                if (err) {
                    observer.error({
                        'error': 'Unable to load Hyrax version information.',
                        "errorCode": 404,
                        'error-text': err
                    });
                }
                else {
                    var allVersionFiles = new hyrax_version_model_1.AllVersionFiles(requestedVersion);
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var thisFile = fs.readFileSync(path.join(_this.hyraxDir, requestedVersion, file), 'utf8');
                        if (file.includes("download")) {
                            var sections = thisFile.split("#SPLIT#");
                            sections.shift();
                            allVersionFiles.download = sections;
                        }
                        else if (file.includes("installation")) {
                            allVersionFiles.installation = thisFile;
                        }
                        else {
                            allVersionFiles.versions.push(JSON.parse(thisFile));
                        }
                    }
                    observer.next(allVersionFiles);
                    observer.complete();
                }
            });
        });
    };
    HyraxModule.prototype.getAllVersions = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            fs.readdir(_this.hyraxDir, function (err, files) {
                if (err) {
                    observer.error({
                        'error': 'Unable to get Hyrax versions.',
                        'errorCode': 404,
                        'error-text': err
                    });
                }
                else {
                    observer.next({
                        versions: files
                    });
                }
            });
        });
    };
    /** @todo all stuff should be parsed server-side */
    HyraxModule.prototype.getVersion = function (version) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            fs.readdir(_this.hyraxDir, function (err, files) {
                if (err) {
                    observer.error({
                        'error': "Unable to read " + (version === -1 ? 'latest' : '') + " Hyrax version.",
                        'errorCode': 404,
                        'error-text': err
                    });
                }
                else {
                    var hyraxVersion = version === -1 ? files.sort()[files.length - 1] : "" + version;
                    _this.getSpecificVersion("" + hyraxVersion).subscribe(function (response) {
                        observer.next(response);
                    }, function (error) {
                        observer.error({
                            'error': "Unable to read " + (version === -1 ? 'latest' : '') + " Hyrax version.",
                            'errorCode': 404,
                            'error-text': error
                        });
                    });
                }
            });
        });
    };
    HyraxModule.prototype.getGuide = function () {
        var hyraxGuide = path.resolve(path.join('hyrax_guide', 'Master_Hyrax_Guide.html'));
        return new rxjs_1.Observable(function (observer) {
            fs.readFile(hyraxGuide, 'utf8', function (error, data) {
                if (error) {
                    observer.error({
                        'error': "Unable to read Hyrax guide.",
                        'errorCode': 404,
                        'error-text': error
                    });
                }
                else {
                    observer.next({ data: data });
                    observer.complete();
                }
            });
        });
    };
    return HyraxModule;
}());
exports.HyraxModule = HyraxModule;
