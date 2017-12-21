export interface LangMap {
    [name: string]: {
        [name: string]: string;
    };
}
export declare class Dict {
    map: LangMap;
    locale: string;
    constructor(map: LangMap, locale: string);
    translate(key: string, locale?: string): string;
}
