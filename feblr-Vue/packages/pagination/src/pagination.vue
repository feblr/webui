<template>
  <div class="feblr-pagination">
    <ul>
      <li class="prev">
        <button type="button" v-on:click="gotoPrevPage(feblrPagination)"><i class="feblr-icon-arrow-left icon"></i></button>
      </li>
      <li class="page" v-for="page in feblrPagination.pages" v-bind:class="{current: page.isCurrent}">
        <button type="button" v-text="page.index + 1" v-on:click="gotoPage(page.index, feblrPagination)"></button>
      </li>
      <li class="next">
        <button type="button" v-on:click="gotoNextPage(feblrPagination)"><i class="feblr-icon-arrow-right icon"></i></button>
      </li>
    </ul>
    <div class="jumper">
      <form v-on:submit.prevent="gotoPage(jumper.page - 1, feblrPagination)">
        <input type="number" v-model="jumper.page" />
      </form>
    </div>
  </div>
</template>

<script>
import { Pagination } from 'feblr-view-model'

export default {
  props: {
    feblrPagination: {
      required: true,
      type: Pagination
    }
  },
  data: function () {
    return {
      jumper: {
        page: 1
      }
    }
  },
  methods: {
    gotoPrevPage: function (pagination) {
      if (pagination.currPage > 0) {
        pagination.gotoPrevPage()
        this.$emit('pagechange', {
          page: pagination.currPage
        })
      }
    },
    gotoNextPage: function (pagination) {
      if (pagination.currPage < pagination.totalPages - 1) {
        pagination.gotoNextPage()
        this.$emit('pagechange', {
          page: pagination.currPage
        })
      }
    },
    gotoPage: function (page, pagination) {
      if (page !== pagination.currPage && page >= 0 && page < pagination.totalPages) {
        pagination.gotoPage(page)
        this.$emit('pagechange', {
          page: pagination.currPage
        })
      }
    }
  }
}
</script>