export interface Range {
    min: number;
    max: number;
}
export interface Page {
    index: number;
    isCurrent: boolean;
}
export declare let defaultPagesCount: number;
export declare class Pagination {
    currPage: number;
    itemsPerPage: number;
    totalItems: number;
    pagesCount: number;
    pages: Page[];
    totalPages: number;
    lastPage: number;
    constructor(currPage: number, itemsPerPage: number, totalItems: number, pagesCount?: number);
    caculatePagesRange(currPage: number, totalPages: number, pagesCount: number): Range;
    updateState(currPage: number, itemsPerPage: number, totalItems: number): void;
    gotoPage(nextPage: number): void;
    gotoPrevPage(): void;
    gotoNextPage(): void;
    gotoLastPage(): void;
}
