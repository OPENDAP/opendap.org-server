import showdown from 'showdown';

export class MarkdownModel {
    title: string;
    md: string;
    id: number;
    tags: string[];

    private converter = new showdown.Converter();
    
    /*
    * Processes a markdown file by splitting the title out of the document
    * and converting the body to HTML with showdown.
    * @param {string} md The markdown file to be processed.
    */
    constructor(rawMd: string, id = 0) {
        let split = rawMd.split("\n")[0];
        let md = rawMd.substring(split.length + 3, rawMd.length);
        let tags = rawMd.split("##TAGS##");

        if (tags.length == 2) {
            md = tags[0].substring(split.length + 3, md.length);
            tags = tags[1].substr(2, tags[1].length).split(",");
        } else {
            tags = [];
        }

        this.title = split.substring(2, split.length - 1);;
        this.md = this.converter.makeHtml(md);
        this.id = id;
        this.tags = tags;
    }
}
