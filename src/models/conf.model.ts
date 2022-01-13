export interface Conf {
  pageTitle: string;
  sections: Section[];
}

export interface Section {
  sectionType: 'standard' | 'gallery',
  title: string;
  id: string;
  filename: string;
  hideTitle: false;
}