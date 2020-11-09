const fs = require('fs');
const path = require('path');

const hyraxDir = path.resolve(path.join('public', 'Hyrax'));

/**
 * Returns a specific version of Hyrax data from the server.
 * @param {string} requestedVersion The version that the api will serve.
 * @param {response} res The response that will serve the data.
 */
function getSpecificVersion(requestedVersion, res) {
    const versionPath = path.join(hyraxDir, requestedVersion);

    fs.readdir(versionPath, (err, files) => {
        if (err) throw err;

        allVersionFiles = {
            hyraxVersion: requestedVersion,
            versions: [],
            download: null,
            installation: null
        };

        for (let f of files) {
            let thisFile = fs.readFileSync(path.join(hyraxDir, requestedVersion, f), 'utf8');

            if (f.includes("download")) {

                let sections = thisFile.split("#SPLIT#");
                sections.shift();

                allVersionFiles.download = sections;
            } else if (f.includes("installation")) {
                allVersionFiles.installation = thisFile;
            } else {
                allVersionFiles.versions.push(JSON.parse(thisFile));
            }
        }

        res.status(200).send(allVersionFiles);
    });
}

module.exports = {
    getAllVersions: function (res) {
        fs.readdir(hyraxDir, (err, files) => {
            if (err) throw err;

            res.status(200).send({
                versions: files
            });
        });
    },
    getLatestVersion: function (req, res) {
        fs.readdir(hyraxDir, (err, files) => {
            if (err) throw err;

            getSpecificVersion(files.sort()[files.length - 1], res);
        });
    },
    getVersion: function (req, res) {
        getSpecificVersion(req.params['version'], res);
    }
}

