import path = require('path');
import fs = require('fs');

export class Links {
  public static contentRoot = path.resolve('public/content');

  public static pages = path.resolve(Links.contentRoot, 'adoc');
  public static faq = path.resolve(Links.contentRoot, 'faq');
  public static hyrax = path.resolve(Links.contentRoot, 'hyrax');
}

export class FileTooling {
  public static existsSyncLazy(_path: string, substrFrom?: number, substrLength?: number) {
    try {
      if (substrFrom) {
        const files = fs.readdirSync(_path);
        files.forEach(file => {
          const lazyPath = path.resolve(_path, file.substring(substrFrom, substrLength));
          console.log(lazyPath);
        });
      } else {
        return fs.existsSync(_path);
      }
    } catch (error) {
      throw error;
    }
  }
}