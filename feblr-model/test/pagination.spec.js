"use strict";
var tape = require('tape');
var pagination_1 = require('../src/pagination');
tape('pagination instance should have default properties', function (test) {
    var pagination = new pagination_1.Pagination(0, 10, 0);
    test.equal(pagination.currPage, 0, 'currPage should be 0');
    test.equal(pagination.itemsPerPage, 10, 'itemsPerPage should be 10');
    test.equal(pagination.totalItems, 0, 'totalItems should be 0');
    test.equal(pagination.pagesCount, pagination_1.defaultPagesCount, 'pagesCount should be 5');
    test.equal(pagination.totalPages, 0, 'totalPages should be 0');
    test.equal(pagination.pages.length, 0, 'pages should be empty array');
    test.end();
});
tape('pagination instance should have correct properties', function (test) {
    var pagination = new pagination_1.Pagination(2, 10, 100);
    test.equal(pagination.currPage, 2, 'currPage should be 2');
    test.equal(pagination.itemsPerPage, 10, 'itemsPerPage should be 10');
    test.equal(pagination.totalItems, 100, 'totalItems should be 100');
    test.equal(pagination.pagesCount, pagination_1.defaultPagesCount, 'pagesCount should be 5');
    test.equal(pagination.totalPages, 10, 'totalPages should be 10');
    test.equal(pagination.pages.length, pagination_1.defaultPagesCount, 'pagination should have five pages');
    test.end();
});
tape('pagination instance should update currPage and pages when gotoPage called', function (test) {
    var currPage = 0;
    var itemsPerPage = 10;
    var totalPages = 10;
    var totalItems = itemsPerPage * totalPages;
    var pagination = new pagination_1.Pagination(currPage, itemsPerPage, totalItems);
    var middlePage = (pagination.pagesCount - 1) / 2;
    var _loop_1 = function(testPage) {
        pagination.gotoPage(testPage);
        test.equal(pagination.pages.length, pagination_1.defaultPagesCount, 'pagination should have five pages');
        pagination.pages.forEach(function (page, index) {
            test.equal(page.index, index, 'page should have correct index');
            test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
        });
    };
    for (var testPage = 0; testPage < middlePage; testPage++) {
        _loop_1(testPage);
    }
    var _loop_2 = function(testPage) {
        pagination.gotoPage(testPage);
        test.equal(pagination.pages.length, pagination_1.defaultPagesCount, 'pagination should have five pages');
        pagination.pages.forEach(function (page, index) {
            test.equal(page.index, testPage - middlePage + index, 'page should have correct index');
            test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
        });
    };
    for (var testPage = middlePage; testPage < totalPages - middlePage; testPage++) {
        _loop_2(testPage);
    }
    var _loop_3 = function(testPage) {
        pagination.gotoPage(testPage);
        test.equal(pagination.pages.length, pagination_1.defaultPagesCount, 'pagination should have five pages');
        pagination.pages.forEach(function (page, index) {
            test.equal(page.index, totalPages - pagination.pagesCount + index, 'page should have correct index');
            test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
        });
    };
    for (var testPage = totalPages - middlePage; testPage < totalPages; testPage++) {
        _loop_3(testPage);
    }
    test.end();
});
//# sourceMappingURL=pagination.spec.js.map