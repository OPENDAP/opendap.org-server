export class TocNode {
  level: number;
  id: string;
  text: string;
  children: Array<TocNode>;

  constructor(level: number, id: string, text: string, children = new Array<TocNode>()) {
    this.level = level;
    this.id = id;
    this.text = text;
    this.children = children;
  }
}
