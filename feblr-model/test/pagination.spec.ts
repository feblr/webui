import * as tape from 'tape';
import { Pagination, defaultPagesCount } from '../src/pagination';

tape('pagination instance should have default properties', function (test) {
  let pagination = new Pagination(0, 10, 0);

  test.equal(pagination.currPage, 0, 'currPage should be 0');
  test.equal(pagination.itemsPerPage, 10, 'itemsPerPage should be 10');
  test.equal(pagination.totalItems, 0, 'totalItems should be 0');
  test.equal(pagination.pagesCount, defaultPagesCount, 'pagesCount should be 5');
  test.equal(pagination.totalPages, 0, 'totalPages should be 0');
  test.equal(pagination.pages.length, 0, 'pages should be empty array');

  test.end();
});

tape('pagination instance should have correct properties', function (test) {
  let pagination = new Pagination(2, 10, 100);

  test.equal(pagination.currPage, 2, 'currPage should be 2');
  test.equal(pagination.itemsPerPage, 10, 'itemsPerPage should be 10');
  test.equal(pagination.totalItems, 100, 'totalItems should be 100');
  test.equal(pagination.pagesCount, defaultPagesCount, 'pagesCount should be 5');
  test.equal(pagination.totalPages, 10, 'totalPages should be 10');
  test.equal(pagination.pages.length, defaultPagesCount, 'pagination should have five pages');

  test.end();
});

tape('pagination instance should update currPage and pages when gotoPage called', function (test) {
  let currPage = 0;
  let itemsPerPage = 10;
  let totalPages = 10;
  let totalItems = itemsPerPage * totalPages;
  let pagination = new Pagination(currPage, itemsPerPage, totalItems);
  let middlePage = (pagination.pagesCount - 1) / 2;

  for (let testPage = 0; testPage < middlePage; testPage++) {
    pagination.gotoPage(testPage)

    test.equal(pagination.pages.length, defaultPagesCount, 'pagination should have five pages');

    pagination.pages.forEach(function (page, index) {
      test.equal(page.index, index, 'page should have correct index');

      test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
    });
  }

  for (let testPage = middlePage; testPage < totalPages - middlePage; testPage++) {
    pagination.gotoPage(testPage)

    test.equal(pagination.pages.length, defaultPagesCount, 'pagination should have five pages');

    pagination.pages.forEach(function (page, index) {
      test.equal(page.index, testPage - middlePage + index, 'page should have correct index');

      test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
    });
  }

  for (let testPage = totalPages - middlePage; testPage < totalPages; testPage++) {
    pagination.gotoPage(testPage)

    test.equal(pagination.pages.length, defaultPagesCount, 'pagination should have five pages');

    pagination.pages.forEach(function (page, index) {
      test.equal(page.index, totalPages - pagination.pagesCount + index, 'page should have correct index');

      test.equal(page.isCurrent, page.index === testPage, 'page should have isCurrent set');
    });
  }

  test.end();
});
