import Vue from 'vue';
import { Pagination as FeblrPagination } from 'feblr-view-model';
import { Pagination } from '../../src/index';

const extraButtons = 2; // for prev and next buttons
const defaultPageNum = 5;

const Container = Vue.extend({
  template: '<pagination v-bind:feblrPagination="feblrPagination" v-on:pagechange="onPageChange"></pagination>',
  props: {
    feblrPagination: {
      type: FeblrPagination
    },
    callback: {
      type: Function
    }
  },
  methods: {
    onPageChange: function () {
      this.callback()
    }
  },
  components: {
    pagination: Pagination
  }
})

describe('pagination.vue', () => {
  let createPagination = function (currPage, callback) {
    let itemsPerPage = Math.ceil(Math.random() * 10)
    let pageNum = Math.ceil(Math.random() * 10) + currPage + 1
    let feblrPagination = new FeblrPagination(currPage, itemsPerPage, pageNum * itemsPerPage);

    let propsData = {
      feblrPagination: feblrPagination,
      callback: callback
    }
    let component = new Container({ propsData }).$mount()

    return { component, feblrPagination }
  }

  let caculatePageNum = function (feblrPagination) {
    return Math.min(feblrPagination.totalPages, defaultPageNum) + 2
  }

  it('should render correct contents', () => {
    let { feblrPagination, component } = createPagination(0)

    expect(component.$el.querySelectorAll('.feblr-pagination li').length).to.equal(caculatePageNum(feblrPagination))
  })

  it('should goto next page and call onPageChange when clicking next btn', () => {
    let onPageChange = sinon.spy()

    let { feblrPagination, component } = createPagination(0, onPageChange)
    let lastPage = feblrPagination.currPage

    triggerEvent(component.$el.querySelector('.feblr-pagination .next button'), 'click')

    expect(onPageChange.called).to.equal(true)
    expect(feblrPagination.currPage).to.equal(lastPage + 1)
  })

  it('should goto prev page and call onPageChange when clicking prev btn', () => {
    let onPageChange = sinon.spy()

    let { feblrPagination, component } = createPagination(1, onPageChange)
    let lastPage = feblrPagination.currPage

    triggerEvent(component.$el.querySelector('.feblr-pagination .prev button'), 'click');

    expect(onPageChange.called).to.equal(true)
    expect(feblrPagination.currPage).to.equal(lastPage - 1)
  })

  it('should goto correct page and call onPageChange when clicking visible page btn', () => {
    let onPageChange = sinon.spy()
    let { feblrPagination, component } = createPagination(0, onPageChange)

    let targetPageIndex = feblrPagination.currPage + Math.min(defaultPageNum, feblrPagination.totalPages) - 1
    let targetPage = component.$el.querySelectorAll('.feblr-pagination .page button')[targetPageIndex]
    triggerEvent(targetPage, 'click');

    expect(onPageChange.called).to.equal(true)
    expect(feblrPagination.currPage).to.equal(parseInt(targetPage.textContent) - 1)
  })

  it('should goto target page and call onPageChange when submitting jumper form', () => {
    let onPageChange = sinon.spy()

    let { feblrPagination, component } = createPagination(3, onPageChange)

    let targetPage = 1
    let jumperPage = component.$el.querySelector('.feblr-pagination .jumper input')
    jumperPage.val = targetPage
    triggerEvent(jumperPage, 'input')
    triggerEvent(component.$el.querySelector('.feblr-pagination .jumper form'), 'submit')

    expect(onPageChange.called).to.equal(true)
    expect(feblrPagination.currPage).to.equal(targetPage - 1)
  })
})
