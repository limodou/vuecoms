<template>
  <div class="pagination">
    <ul>
      <li v-if="store.first" :title="store.first" class="ivu-btn ivu-btn-default ivu-btn-small" :class="{'disabled':!hasFirst}">
        <a @click.prevent="handlePageClick(1)">{{store.first}}</a>
      </li>
      <li v-if="store.prev" :title="store.prev" class="ivu-btn ivu-btn-default ivu-btn-small" :class="{'disabled':!hasPrev}">
        <a @click.prevent="handlePageClick(current-1)">{{store.prev}}</a>
      </li>
      <li v-if="store.next" :title="store.next" class="ivu-btn ivu-btn-default ivu-btn-small" :class="{'disabled':!hasNext}">
        <a @click.prevent="handlePageClick(current+1)">{{store.next}}</a>
      </li>
      <li v-if="store.last" :title="store.last" class="ivu-btn ivu-btn-default ivu-btn-small" :class="{'disabled':!hasLast}">
        <a @click.prevent="handlePageClick(pages)">{{store.last}}</a>
      </li>
      <Dropdown class="ivu-btn ivu-btn-default ivu-btn-small" @on-click="handlePageSize" transfer>
        <a>
          {{limit}}条/页
          <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem v-for="x in store.pageSizeOpts" :key="x" :name="x">{{x}}条/页</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <li class="ivu-btn ivu-btn-text ivu-btn-small page-input">
      跳至
        <input type="text" ref='page' :value="current" @keypress.enter="handleEnter">
      页
      </li>
    </ul>

    <slot></slot>
    <span class="page-total">共 {{pages}} 页/{{store.total}} 条记录</span>
  </div>
</template>

<script>
import {clickoutside} from '../utils/utils.js'
import Emitter from '../mixins/emitter.js'

export default {
  name: 'Pagination',
  mixins: [ Emitter ],

  data () {
    return {
      current: this.store.page,
      limit: this.store.pageSize
    }
  },

  directives: { clickoutside },

  props: {
    store: Object
  },

  computed: {
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
      return Math.ceil(this.store.total / this.limit)
    },

    dropdownStyles () {
      if (this.showPageSize) {
        return {display: 'block', position: 'absolute', marginLeft: '-6px', marginTop: '2px'}
      } else {
        return {display: 'none'}
      }
    }
  },

  methods: {
    handlePageSize (size) {
      this.limit = size
      this.$emit('on-page-size', size)
      this.current = 1
      this.$emit('on-page', 1)
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
  },

  watch: {
    'store.states.page': {
      handler: function (val) {
        this.current = val
      }
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
  position: relative;

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

    li {
      margin-top: 0px;
      position: relative;
      margin-right: 4px;
    }

    .ivu-dropdown-rel > a {
      color: inherit;
    }
  }

  .page-total {
    height: 24px;
    line-height: 24px;
    margin: 0px 8px;
    float: right!important;
    font-size: 12px;
  }

  .page-input {
    input {
      height: 20px;
      width: 30px;
      line-height: 20px;
      border: 1px solid #dddee1;
      vertical-align: middle;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
