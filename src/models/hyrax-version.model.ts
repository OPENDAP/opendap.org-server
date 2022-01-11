export class AllVersionFiles {
  hyraxVersion: string;

  versions: string[] = [];
  download: string[] = [];
  installation: string = '';

  constructor(hyraxVersion: string) {
    this.hyraxVersion = hyraxVersion;
  }
}
