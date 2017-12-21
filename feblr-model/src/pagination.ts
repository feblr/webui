export interface Range {
  min: number;
  max: number;
}

export interface Page {
  index: number;
  isCurrent: boolean;
}

export let defaultPagesCount = 5;

export class Pagination {
  pages: Page[];
  totalPages: number;
  lastPage: number;

  constructor(public currPage: number, public itemsPerPage: number, public totalItems: number, public pagesCount: number = defaultPagesCount) {
    this.pages = [];
    this.lastPage = -1;

    this.updateState(this.currPage, this.itemsPerPage, this.totalItems);
  }

  caculatePagesRange(currPage: number, totalPages: number, pagesCount: number): Range {
    if (totalPages <= pagesCount) {
      return {
        min: 0,
        max: totalPages - 1
      };
    }

    let min: number;
    let max: number;

    let middlePage = (this.pagesCount - 1) / 2;

    if (currPage <= middlePage) {
      min = 0;
      max = this.pagesCount - 1;
    } else if (currPage >= (totalPages - middlePage)) {
      min = totalPages - pagesCount;
      max = totalPages - 1;
    } else {
      min = currPage - middlePage;
      max = currPage + middlePage;
    }

    return {
      min: min,
      max: max
    };
  }

  updateState(currPage: number, itemsPerPage: number, totalItems: number) {
    this.totalPages = Math.ceil(totalItems / itemsPerPage);

    if (this.totalPages > 0) {
      let range = this.caculatePagesRange(this.currPage, this.totalPages, this.pagesCount);

      this.pages.splice(0, this.pages.length);
      for (let i = range.min; i <= range.max; i++) {
        this.pages.push({
          index: i,
          isCurrent: i === this.currPage
        });
      }
    }
  }

  gotoPage(nextPage: number) {
    if (nextPage === this.currPage) {
      return;
    }

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.lastPage = this.currPage;
    this.currPage = nextPage;

    this.updateState(this.currPage, this.itemsPerPage, this.totalItems);
  }

  gotoPrevPage() {
    this.gotoPage(this.currPage - 1);
  }

  gotoNextPage() {
    this.gotoPage(this.currPage + 1);
  }

  gotoLastPage() {
    this.gotoPage(this.lastPage);
  }
}
