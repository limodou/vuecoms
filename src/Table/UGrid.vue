<template>
  <div class="u-grid">
    <u-table v-if="leftWidth"
      :store="store"
      :width="leftWidth"
      :table-width="leftWidth"
      :table-class="leftTableClass"
      fixed="left"
      ref="left">
    </u-table>

    <u-table :store="store"
      :width="gridWidth"
      :table-width="tableWidth"
      table-class="u-grid-body"
      ref="table"
      @scroll="handleScroll"
      ></u-table>

    <div class="column-dragger-guide" v-show="columnResizing" :style="columnDraggerStyles"></div>

    <Pagination v-if="pagination" :store="store"></Pagination>
  </div>
</template>

<script>
import UTable from './UTable'
import Store from './UGridStore'
import Pagination from './pagination'
import {mapState, mapMethod} from '@/utils/utils.js'
import Emitter from '@/mixins/emitter.js'

export default {
  name: 'Grid',
  mixins: [ Emitter ],

  components: {
    UTable,
    Pagination
  },

  data () {
    const store = new Store(this, this.data)

    return {
      store
    }
  },

  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  computed: {
    ...mapState('columns', 'columnResizing', 'checkCol',
      'gridWidth', 'width', 'resizable', 'columnPosition', 'guiderHeight',
      'defaultColWidth', 'leftWidth', 'checkColTitle', 'checkColWidth',
      'indexColWidth', 'indexColTitle', 'scrollLeft', 'total', 'pageSizeOpts',
      'pagination'
    ),

    columnDraggerStyles () {
      return {
        left: (this.columnPosition - 7) + 'px',
        height: this.guiderHeight + 'px'
      }
    },

    tableWidth () {
      let w = 0
      this.columns.forEach(col => { w = col.hidden ? w : w + col.width })
      return w
    },

    leftTableClass () {
      let cls = 'u-grid-body u-table-left'
      if (this.scrollLeft) {
        cls += ' dark'
      }
      return cls
    }

  },

  methods: {
    ...mapMethod('getSelection'),

    resize () {
      if (this.width === 'auto') {
        this.store.states.gridWidth = this.$el.clientWidth
      } else {
        this.store.states.gridWidth = this.width
      }

      if (!this.resizable) return
      // let parentWidth = this.$el.clientWidth
      let cols = []
      let w = this.gridWidth
      let hasLeftFixed = false

      for (let i = 0, len = this.columns.length; i < len; i++) {
        let col = this.columns[i]
        if (col.hidden) continue
        if (col.width) {
          w -= col.width
        } else {
          cols.push(col)
        }
        if (col.fixed === 'left') {
          hasLeftFixed = true
        }
      }

      if (cols.length > 0 && this.gridWidth) {
        let len = cols.length

        // 当总宽度小于实际宽度，未设宽度的列使用缺省最小宽度
        let stepW = w / len
        let lastW = w - (len - 1) * stepW
        for (let i = 0; i < len; i++) {
          if (w > 0) {
            if (i === len - 1) {
              cols[i].width = Math.max(lastW, this.defaultColWidth)
            } else {
              cols[i].width = Math.max(stepW, this.defaultColWidth)
            }
          } else {
            cols[i].width = this.defaultColWidth
          }
        }
      }

      // 处理左侧固定列
      if (hasLeftFixed) {
        let leftCols = []
        let restCols = []
        this.store.states.leftWidth = 0

        for (let i = 0, len = this.columns.length; i < len; i++) {
          let col = this.columns[i]
          if (col.hidden) continue
          if (col.type === 'check' || col.type === 'index' || col.fixed === 'left') {
            leftCols.push(col)
            this.store.states.leftWidth += col.width
          } else {
            restCols.push(col)
          }
        }
        this.store.states.columns = leftCols.concat(restCols)
      }
    },

    getDefaultColumn (options) {
      return Object.assign({
        name: 'title',
        width: 0,
        sortable: false,
        align: 'left',
        hidden: false,
        fixed: '',
        resizable: true,
        type: 'column'
      }, options || {})
    },

    getDefaultRow (row) {
      return Object.assign({
        _selected: false,
        _hover: false
      }, row)
    },

    makeCols () {
      var cols = []

      // 生成checkbox列
      if (this.checkCol) {
        let d = this.getDefaultColumn({
          name: '__check_col__',
          type: 'check',
          resizable: false,
          width: this.checkColWidth,
          title: this.checkColTitle,
          align: 'center'
        })
        cols.push(d)
      }

      // 生成序号列
      if (this.indexCol) {
        let d = this.getDefaultColumn({
          name: '__index_col__',
          type: 'index',
          resizable: false,
          width: this.indexColWidth,
          title: this.indexColTitle,
          align: 'center'
        })
        cols.push(d)
      }

      this.columns.forEach(col => {
        let d = this.getDefaultColumn()
        if (!d.title) d.title = d.name
        Object.assign(d, col)
        cols.push(d)
      })

      return cols
    },

    makeRows () {
      var rows = []
      this.store.states.data.forEach(row => {
        rows.push(this.getDefaultRow(row))
      })
      return rows
    },

    handleResize () {
      this.resize()
    },

    handleScroll (left, top) {
      if (this.leftWidth) {
        this.$refs.left.$refs.body.scrollTop = top
      }
    }
  },

  created () {
    this.store.states.columns = this.makeCols()
    this.store.states.data = this.makeRows()
  },

  mounted () {
    this.resize()

    window.addEventListener('resize', this.handleResize, true)
  },

  watch: {

  }
}
</script>

<style>
.u-grid {
  position: relative;
  font-size: 14px;
}
.u-grid .column-dragger-guide {
  height: 100%;
  top: 0px;
  left: 0px;
  border-left: 2px solid green;
  position: absolute;
  z-index: 1000;
}
.u-grid .u-table-left {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  border-right: none;
  border-bottom: none;
}
.u-grid .u-table-left.dark {
  box-shadow: 1px 0px 2px #999;
}
.u-grid .u-table-left .u-table-body-scroll {
  overflow: hidden;
}
</style>
