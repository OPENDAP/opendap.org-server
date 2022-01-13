import { Links } from '../classes/utils';

import path = require('path');
import fs = require('fs');

export interface MenuItem {
  name: string;
  link?: string;
  menuItems?: MenuItem[];
}

export class MenuBuilder {

  public menu: MenuItem[] = [];

  constructor() {
    this.menu = (JSON.parse(fs.readFileSync(
      path.resolve(Links.contentRoot, 'menu.conf.json'), 'utf-8')) as {menu: MenuItem[]}).menu;
  }
}