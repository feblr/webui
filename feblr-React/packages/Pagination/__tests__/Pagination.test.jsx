// Link.react-test.js
import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Pagination from '../src/index';
import { Pagination as FeblrPagination } from 'feblr-view-model';

test('Pagination structure', () => {
  let pagination = new FeblrPagination(0, 10, 100);
  let callback = jest.fn();

  const component = renderer.create(
    <Pagination feblrPagination={pagination} onPageChange={callback} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Pagination next page', () => {
  let pagination = new FeblrPagination(0, 10, 100);
  let callback = jest.fn();

  const component = shallow(
    <Pagination feblrPagination={pagination} onPageChange={callback} />
  );

  component.find('.prev button').simulate('click');

  expect(callback.mock.calls.length).toEqual(1);
  expect(callback.mock.calls).toEqual([[{ page: -1 }]]);
});

test('Pagination next page', () => {
  let pagination = new FeblrPagination(0, 10, 100);
  let callback = jest.fn();

  const component = shallow(
    <Pagination feblrPagination={pagination} onPageChange={callback} />
  );

  component.find('.next button').simulate('click');

  expect(callback.mock.calls.length).toEqual(1);
  expect(callback.mock.calls).toEqual([[{ page: 1 }]]);
});

test('Pagination target page', () => {
  let pagination = new FeblrPagination(0, 10, 100);
  let callback = jest.fn();

  const component = shallow(
    <Pagination feblrPagination={pagination} onPageChange={callback} />
  );

  let index = 2;
  component.find('.page button').at(index).simulate('click', {
    target: {
      tagName: 'BUTTON',
      textContent: index + 1 + ''
    }
  });

  expect(callback.mock.calls.length).toEqual(1);
  expect(callback.mock.calls).toEqual([[{ page: index }]]);
});

test('Pagination jumper', () => {
  let pagination = new FeblrPagination(0, 10, 100);
  let callback = jest.fn();

  const component = shallow(
    <Pagination feblrPagination={pagination} onPageChange={callback} />
  );

  let input = '3';
  component.find('.jumper input').first().simulate('change', {
    target: {
      value: input
    }
  });

  component.find('.jumper form').simulate('submit', {
    target: component.find('.jumper form')
  });

  expect(callback.mock.calls.length).toEqual(1);
  expect(callback.mock.calls).toEqual([[{ page: parseInt(input) - 1 }]]);
});
