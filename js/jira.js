const request = require('request');

module.exports = {
    // Returns a Jira issue from OPeNDAP's Jira server.
    getIssue: function (req, res) {
        request(`https://opendap.atlassian.net/rest/api/2/issue/${req.params['issue']}`, { json: true }, (err, thisRes) => {
            if (err) throw err;

            res.status(200).send(thisRes);
        });
    },
    // Returns the HK versions from OPeNDAP's Jira server.
    getFixVersions: function (res) {
        request('https://opendap.atlassian.net/rest/api/2/project/HK/versions', { json: true }, (err, thisRes) => {
            if (err) throw err;

            res.status(200).send(thisRes);
        });
    },
    // Returns all of the issues in a specific fix version
    getFixVersionByID: function (req, res) {
        let search = `search?jql=project=HK AND fixversion=${req.params['fixVersionID']}`;
        let url = `https://opendap.atlassian.net/rest/api/2/${search}`;

        request(url, { json: true }, (err, thisRes) => {
            if (err) throw err;

            res.status(200).send(thisRes);
        });
    }
}
