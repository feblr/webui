export interface LangMap {
  [name: string]: {
    [name: string]: string;
  };
}

export class Dict {
  constructor(public map: LangMap, public locale: string) {
  }

  translate(key: string, locale?: string): string {
    let _locale = locale ? locale : this.locale;
    let map = this.map[_locale];
    if (map) {
      return map[key];
    } else {
      return '';
    }
  }
}
