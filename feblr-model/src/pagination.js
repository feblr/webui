"use strict";
exports.defaultPagesCount = 5;
var Pagination = (function () {
    function Pagination(currPage, itemsPerPage, totalItems, pagesCount) {
        if (pagesCount === void 0) { pagesCount = exports.defaultPagesCount; }
        this.currPage = currPage;
        this.itemsPerPage = itemsPerPage;
        this.totalItems = totalItems;
        this.pagesCount = pagesCount;
        this.pages = [];
        this.lastPage = -1;
        this.updateState(this.currPage, this.itemsPerPage, this.totalItems);
    }
    Pagination.prototype.caculatePagesRange = function (currPage, totalPages, pagesCount) {
        if (totalPages <= pagesCount) {
            return {
                min: 0,
                max: totalPages - 1
            };
        }
        var min;
        var max;
        var middlePage = (this.pagesCount - 1) / 2;
        if (currPage <= middlePage) {
            min = 0;
            max = this.pagesCount - 1;
        }
        else if (currPage >= (totalPages - middlePage)) {
            min = totalPages - pagesCount;
            max = totalPages - 1;
        }
        else {
            min = currPage - middlePage;
            max = currPage + middlePage;
        }
        return {
            min: min,
            max: max
        };
    };
    Pagination.prototype.updateState = function (currPage, itemsPerPage, totalItems) {
        this.totalPages = Math.ceil(totalItems / itemsPerPage);
        if (this.totalPages > 0) {
            var range = this.caculatePagesRange(this.currPage, this.totalPages, this.pagesCount);
            this.pages.splice(0, this.pages.length);
            for (var i = range.min; i <= range.max; i++) {
                this.pages.push({
                    index: i,
                    isCurrent: i === this.currPage
                });
            }
        }
    };
    Pagination.prototype.gotoPage = function (nextPage) {
        if (nextPage === this.currPage) {
            return;
        }
        if (nextPage < 0 || nextPage >= this.totalPages) {
            return;
        }
        this.lastPage = this.currPage;
        this.currPage = nextPage;
        this.updateState(this.currPage, this.itemsPerPage, this.totalItems);
    };
    Pagination.prototype.gotoPrevPage = function () {
        this.gotoPage(this.currPage - 1);
    };
    Pagination.prototype.gotoNextPage = function () {
        this.gotoPage(this.currPage + 1);
    };
    Pagination.prototype.gotoLastPage = function () {
        this.gotoPage(this.lastPage);
    };
    return Pagination;
}());
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map