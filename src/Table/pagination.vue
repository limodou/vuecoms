<template>
  <div class="pagination">
    <ul>
      <li v-if="first" :title="first" class="page-first page-item" :class="{'page-disabled':!hasFirst}">
        <a @click.prevent="handlePageClick(1)">{{first}}</a>
      </li>
      <li v-if="prev" :title="prev" class="page-prev page-item" :class="{'page-disabled':!hasPrev}">
        <a @click.prevent="handlePageClick(current-1)">{{prev}}</a>
      </li>
      <li class="page-item page-input">
      第
        <input type="text" ref='page' :value="current" @keypress.enter="handleEnter">
      页/共 {{pages}} 页
      </li>
      <div class="page-options" v-clickoutside="handleClose">
        <div class="page-options-sizer">
          <div class="select-single">
            <div class="select-selection" @click.prevent="handlePageSizeDropdown">
              <span class="select-selected-value">{{limit}} 条/页</span>
              <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"></i>
            </div>
            <div class="select-dropdown" :style="dropdownStyles">
              <ul class="select-dropdown-list">
                <li v-for="x in pageSizeOpts" class="select-item" :class="{'select-item-selected':limit === x}"
                  style="text-align: center;" @click.prevent="handlePageSize(x)">
                  {{x}} 条/页</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <li v-if="next" :title="next" class="page-next page-item" :class="{'page-disabled':!hasNext}">
        <a @click.prevent="handlePageClick(current+1)">{{next}}</a>
      </li>
      <li v-if="last" :title="last" class="page-last page-item" :class="{'page-disabled':!hasLast}">
        <a @click.prevent="handlePageClick(pages)">{{last}}</a>
      </li>
    </ul>

    <slot></slot>
    <span class="page-total">共 {{total}} 条记录</span>
  </div>
</template>

<script>
import {clickoutside, mapState} from '@/utils/utils.js'
import Emitter from '@/mixins/emitter.js'

export default {
  name: 'Pagination',
  mixins: [ Emitter ],

  data () {
    return {
      current: this.store.states.page,
      showPageSize: false,
      limit: this.store.states.pageSize
    }
  },

  directives: { clickoutside },

  props: {
    store: Object
  },

  computed: {
    ...mapState('total', 'page', 'pageSize', 'pageSizeOpts', 'first', 'prev', 'next', 'last', 'bottomButtons'),

    hasFirst () {
      return this.current !== 1
    },
    hasLast () {
      return this.current < this.pages
    },
    hasPrev () {
      return this.current > 1
    },

    hasNext () {
      return this.current < this.pages
    },

    pages () {
      return Math.ceil(this.total / this.limit)
    },

    dropdownStyles () {
      if (this.showPageSize) {
        return {display: 'block', position: 'absolute', marginLeft: '-12px', marginTop: '2px'}
      } else {
        return {display: 'none'}
      }
    }
  },

  methods: {
    handlePageSizeDropdown () {
      this.showPageSize = !this.showPageSize
    },

    handlePageSize (size) {
      this.limit = size
      this.showPageSize = false
      this.$emit('on-page-size', size)
    },

    handlePageClick (page) {
      this.go(page)
    },

    handleEnter () {
      this.go(parseInt(this.$refs.page.value))
    },

    go (page) {
      if (page < 1 || page > this.pages) return
      this.current = page
      this.$emit('on-page', page)
    },

    handleClose () {
      this.showPageSize = false
    }
  }
}
</script>

<style lang="less">

.pagination {
  list-style: none;
  display: inline-block;
  padding-left: 0;
  margin: 8px 0;
  width: 100%;
  font-size: 14px;

  &:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden
  }

  ul {
    display: inline-block;
  }

  .page-item {
    display: inline-block;
    vertical-align: middle;
    min-width: 24px;
    height: 24px;
    line-height: 24px;
    margin-right: 4px;
    text-align: center;
    list-style: none;
    background-color: #fff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: Arial;
    border: 0;
    border-radius: 2px;
    transition: border .2s ease-in-out,color .2s ease-in-out;

    > a {
      margin: 0;
      text-decoration: none;
      color: #495060;
      padding: 2px 6px;
      border-radius: 0px;
      border: 1px solid #eee;
    }

    &:hover {
      border-color: #2d8cf0;
      background-color: whitesmoke;

      a {
        color: #2d8cf0;
      }
    }
  }

  .page-total {
    height: 24px;
    line-height: 24px;
    margin: 0px 8px;
    float: right!important;
  }

  .page-prev, .page-next, .page-first, .page-last {
    min-width: 20px;
    transition: all .2s ease-in-out;
    cursor: pointer;
  }

  .page-disabled a {
    cursor: not-allowed;
  }

  .page-active {
    background-color: #2d8cf0;
    border-color: #2d8cf0;

    a {
      color: #fff;
    }

    &:hover {
      a {
        color: #fff;
      }
    }
  }

  .page-options {
    display: inline-block;
    vertical-align: middle;

    .page-options-elevator, .page-options-sizer {
      display: inline-block;
    }

    .select-dropdown {
      width: 78px; transform-origin: center top 0px;
      z-index: 9999;

      .select-dropdown-list {
        border: 1px solid #eee;
        list-style: none;
        background-color: white;
        padding: 0;

        .select-item {
          list-style: none;
          padding: 0 8px;;

          &:hover {
            background-color: #ddd;
          }

          &.select-item-selected {
            background-color: #2d8cf0;
            color: white;
          }
        }
      }
    }
  }

  .select-single {
    border: 1px solid #eee;
    padding: 0px 7px;
    cursor: pointer;

    .ivu-select-arrow {
      position: initial;
    }
  }

  .page-input {
    input {
      height: 20px;
      width: 30px;
      border: 1px solid #dddee1;
      vertical-align: middle;
    }
  }

}
</style>
