<template>
  <div class="u-card-list" >
    <slot name="beforeQuery"></slot>
    <Query ref="query" v-if="store.query" v-bind="store.query" 
      @input="handleQuerySubmit" 
      @on-query-change="handleQueryChange"></Query>
    <div v-if="store.data.length === 0">
      <slot name="nodata"><div v-html="store.nodata"></div></slot>
    </div>
    <Scroll v-if="store.scroll" :on-reach-bottom="handleReachBottom">
      <slot :data="store.data"></slot>
    </Scroll>
    <template v-else>
      <slot :data="store.data"></slot>
      <Pagination ref="pagination" v-if="store.pagination && store.data.length > 0"
        :store="store"
        @on-page="handlePage"
        @on-page-size="handlePageSize">
        <Buttons ref="bottomButtons" :buttons="store.bottomButtons" :target="this"></Buttons>
      </Pagination>
    </template>
    <slot name="afterList"></slot>
  </div>
</template>

<script>
import Pagination from '../Table/pagination'
import Buttons from '../Table/UButtons'
import Query from '../Query'
import {setChoice} from '../utils/utils.js'

let rowKey = 1

export default {
  props: {
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    // 用于选择控件设置choices
    choices: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  components: {
    Pagination,
    Buttons,
    Query
  },

  data () {
    let _default = {
      query: null,
      pagination: true,
      pageSize: 10,
      total: 0,
      start: 1,
      data: [],
      param: {
        page: 1,
        pageSize: 10
      },
      page: 1,
      prev: '上一页',
      next: '下一页',
      pageSizeOpts: [10, 20, 30],
      autoLoad: true,
      onLoadData: null,
      bottomButtons: [],
      loadingText: 'loading...',
      loading: false,
      nodata: '暂无数据',
      scroll: false // 是否无限滚动
    }
    let d = Object.assign(_default, this.config)
    return {store: d}
  },

  mounted() {
    // 初始化query 的 param
    this.store.param = {page: this.store.page, pageSize: this.store.pageSize}
    if (this.$refs.query && this.$refs.query.value)
      this.store.param = Object.assign(this.store.param, this.$refs.query.value)

    if (this.store.autoLoad) {
      this.$nextTick( () => {
        this.loadData()
      })
    }
  },

  methods: {
    handlePage (page) {
      this.$nextTick( () => {
        this.$set(this.store.param, 'page', page)
        this.store.page = page
        this.store.start = (page - 1) * this.store.pageSize + 1
        this.loadData()
      })
    },

    handlePageSize (size) {
      this.$nextTick( () => {
        this.$set(this.store.param, 'pageSize', size)
        this.store.pageSize = size
        this.store.start = (this.store.page - 1) * size + 1
        this.loadData()
      })
    },

    handleQueryChange (change) {
      this.$emit('on-query-change', change)
    },

    handleReachBottom () {
      if (this.store.param.page + 1 <= Math.ceil(this.store.total / this.store.pageSize)) {
        this.store.param.page = this.store.param.page + 1
        return this.loadData()
      }
    },

    go(page) {
      this.$refs.pagination.go(page)
    },

    loadData (param) {
      return new Promise((resolve, reject) => {
        let args = this.store.param
        // data 为数据行， others 为其它信息，如total
        const callback = (data, others) => {
          if (data) {
            if (!this.store.scroll) {
              this.store.data = []
            }
            this.addRows(data)
          }
          if (others && (others instanceof Object)) {
            this.mergeStates(others)
          }
          this.$nextTick( () => {
            this.showLoading(false)
            this.$emit('input', this.store.data)
            resolve(data)
          })
        }
        if (this.store.onLoadData) {
          this.showLoading(true)
          this.store.onLoadData(Object.assign({}, args, param || {}), callback)
        }
      })
    },

    handleQuerySubmit (data) {
      this.store.param = Object.assign(this.store.param, data)
      this.store.page = 1
      this.store.start = 1
      this.$set(this.store.param, 'page', 1)
      this.loadData()
    },

    showLoading (loading=true, text='') {
      this.store.loading = loading
      if (text) {
        this.store.loadingText = text
      }
    },

    mergeStates (o) {
      for (let name in o) {
        if (this.store.hasOwnProperty(name)) {
          this.$set(this.store, name, o[name])
        }
      }
    },

    addRows (rows) {
      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      for (let r of rows) {
        this.store.data.push(Object.assign({_rowKey: rowKey ++}, r))
      }
    }
  },
  
  watch: {
    choices: {
      immediate: true,
      handler (v) {
        if (this.store.query) {
          for(let field of this.store.query.fields) {
            let choices = v[field.name]
            if (choices) {
              setChoice(this, field, choices)
            }
          }
        }
      },
      deep: true
    },

    value: {
      handler: function (value) {
        this.store.data = value
      },
      deep: true
    },


  }
}
</script>