<template>
  <div class="u-table" :class="[tableClass, height==='auto' ? 'auto-height' : '']" :style="wrapStyles" >
    <div class="u-table-header-wrapper"> <!-- Wrapper -->
      <div class="u-table-header-scroll" :style="headerScrollStyles" ref="header"
        @scroll="handleHeaderScroll"
      >
        <table cellspaceing="0" cellpadding="0" border="0" :style="tableStyles" class="u-table-header">
          <colgroup>
            <col v-for="(column, index) in columns" :style="getColumnStyle(column)" :key="column.name">
          </colgroup>
          <thead>
            <tr :style="headerTrStyle" v-for="cols in drawColumns">
              <th v-for="(column, index) in cols" :key="column.name" :style="thStyles(column)"
                :rowspan="column.rowspan" :colspan="column.colspan"
              >
                <HeaderCell :store="store" :column="column"></HeaderCell>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="u-table-body-scroll" :style="bodyStyles" @scroll="handleBodyScroll" ref="body">
      <div class="u-table-no-data" :style="noDataStyles" v-if="data.length===0 && !fixed">{{noData}}</div>
      <table v-else cellspaceing="0" cellpadding="0" border="0" :style="tableStyles" ref="content">
        <colgroup>
          <col v-for="column in columns"  :style="getColumnStyle(column)" :key="column.name">
        </colgroup>
        <tbody ref="table_body">
          <tr v-for="(row, row_index) in rows"
            ref="rows"
            v-if="!row.row._hidden"
            :style="bodyTrStyle"
            :key="getRowId(row.row)"
            :class="{selected:row.row._selected, hover:row.row._hover}"
            @mouseenter="handleTrMouseEnter(row.row)"
            @mouseleave="handleTrMouseLeave(row.row)"
            >
            <td v-for="(col, col_index) in row.columns"
              :key="col_index"
              @click="handleClick(col.row)"
              :style="cellStyles(col.column)"
              :rowspan="col.rowspan"
              :colspan="col.colspan">
              <Cell :store="store" :col="col" :row_index="row_index" :fixed="fixed"></Cell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import {Icon} from "iview"
import {measureScrollbar, mapState, getOffset, mapMethod} from '../utils/utils.js'
import Emitter from '../mixins/emitter.js'
import Cell from './UCell'
import HeaderCell from './UHeaderCell'
import Sortable from 'sortablejs'

export default {
  name: 'Table',

  data () {
    return {
      columnDraggerLeft: 0,
      dragging: false,
      dragging_col_start_x: 0,
      dragging_col: null,
      dragging_col_width: 0
    }
  },

  mixins: [ Emitter ],

  components: {
    Icon,
    Cell,
    HeaderCell
  },

  props: {
    store: {
      required: true
    },

    width: {
    },

    tableClass: {
      type: String
    },

    tableWidth: {
    },

    // 传入指定的表头
    fixed: {
      type: String,
      default: ''
    }
  },

  computed: {
    ...mapState('data', 'nowrap', 'selected', 'idField', 'columns',
      'hscroll', 'xscroll', 'rowHeight', 'height', 'columnResizing',
      'clickSelect', 'checkAll', 'start', 'resizable', 'minColWidth',
      'multiSelect', 'drawColumns', 'combineCols', 'draggable', 'leftWidth', 'rightWidth',
      'tree', 'parentField', 'expandField', 'defaultExpanded', 'noData',
      'noDataHeight'
    ),

    rows () {
      let rows = []
      let item
      let _col
      let c
      let {index, last_columns_set} = this.combineColsIndex()
      let parents_expanded = {}
      let parents_show = {}
      let parents_level = {}
      let parents_rows = {}
      let parent, expanded, pshow, show, level, prow

      this.data.forEach( (row, i) => {
        let new_row = {row: row, columns: []}
        // 增加对父结点是否可见的判断
        if (this.tree) {
          parent = row[this.parentField]
          if (parent !== undefined) {
            expanded = parents_expanded[parent]
            pshow = parents_show[parent]
            level = parents_level[parent]
            if (expanded === undefined) {
              expanded = this.defaultExpanded
            }
            if (pshow === undefined) {
              pshow = true
            }
            if (level === undefined) {
              level = 0
            } else level ++
            prow = parents_rows[parent]
            if (prow === undefined) {
              prow = null
            }
          } else {
            expanded = true
            pshow = true
            level = 0
            prow = null
          }
          if (pshow && expanded) show = true
          else show = false
          this.$set(row, '_hidden', !show)
          this.$set(row, '_level', level)
          //自动设置父结点是已装入状态
          if (prow) {
            this.$set(prow, '_loaded', true)
          }
          parents_expanded[row[this.idField]] = row[this.expandField] === undefined ? this.defaultExpanded : row[this.expandField]
          parents_show[row[this.idField]] = show
          parents_level[row[this.idField]] = level
          parents_rows[row[this.idField]] = row
        }
        rows.push(new_row)
        this.columns.forEach( (col, j) => {
          let item = {value: row[col.name], rowspan: 1, colspan: 1,
            column: col, row: row}

          // 不需要合并
          if (!this.combineCols) {
            new_row.columns.push(item)
          } else {
            // 非合并字段
            c = index[j]
            if (!c) {
              new_row.columns.push(item)
            } else {
              _col = c.last_columns[c.index]
              if (!_col) {
                new_row.columns.push(item)
                c.last_columns.push(item)
              } else {
                // 检查是否相同
                if (_col.value === item.value) {
                  _col.rowspan ++
                } else {
                  c.last_columns.splice(c.index)
                  new_row.columns.push(item)
                  c.last_columns.push(item)
                  if (c.first) {
                    for (let i=1, len=last_columns_set.length; i<len; i++) {
                      last_columns_set[i].splice(0)
                    }
                  }
                }
              }
            }
          }

        })
      })

      return rows
    },

    headerScrollStyles () {
      let style = {}
      let scrollbar = measureScrollbar()
      if (!this.fixed && this.hscroll) {
        style.marginRight = `${scrollbar}px`
        style.borderRight = '1px solid #ddd'
      } else {
        style.marginRight = '0'
        style.borderRight = 'none'
      }
      return style
    },

    wrapStyles () {
      let s = {width: `${this.width - 2}px`}
      let scrollbar = measureScrollbar()
      if (this.fixed === 'right') {
        s.width = `${this.width + 2}px`
        if (this.hscroll) 
          s.right = `${scrollbar}px`
        else
          s.right = '0'
      }
      return s
    },

    tableStyles () {
      let s = {width: `${this.tableWidth}px`}
      if (this.fixed === 'right') {
        s.marginLeft =  `${this.width - this.tableWidth}px`
      }
      return s
    },

    bodyStyles () {
      let scrollbar = measureScrollbar()
      let h = this.height === 'auto' ? 'auto' : this.height + 'px'
      let width = this.width
      if (!this.fixed) {
      if (this.hscroll)
        width = this.width - 3
      else
        width = this.width - 2
      }
      if (this.fixed && this.height !== 'auto' && this.xscroll) {
        h = (this.height - scrollbar) + 'px'
      }
      // if (!this.fixed && this.hscroll) {
      //   width = this.width-scrollbar
      // }
      let options = {height: h, width: width + 'px'}
      return options
    },

    noDataStyles () {
      let scrollbar = measureScrollbar()
      let h = this.height === 'auto' ? this.noDataHeight : this.height
      let options = {height: `${h}px`, width: `${this.width - 2}px`, line: `${h}px`, lineHeight: `${h}px`}
      return options
    },

    bodyWrapperStyles () {
      let h = this.height === 'auto' ? 'auto' : this.height + 'px'
      return {height: h}
    },

    // 表头行样式
    headerTrStyle () {
      return {height: `${this.rowHeight}px`}
    },

    // 表体行样式
    bodyTrStyle () {
      return {height: `${this.rowHeight}px`}
    },

    // 获得序号，根据states.start 作为开始
    index () {
      this.store.states.start ++
      return this.store.states.start - 1
    }

  },

  updated () {
    this.$nextTick(() => {
      this.checkScroll()
    })
  },

  methods: {
    // 表示宽度拖拽鼠标按下事件
    handleMouseDown (col, e) {
      this.store.states.columnResizing = true
      this.dragging_col_start_x = e.clientX
      this.dragging_col = col
      this.dragging_col_width = col.width
      this.dragging_col_new_width = col.width
      // 计算拖动指示器的高度
      this.store.states.guiderHeight = this.$el.offsetHeight

      document.documentElement.addEventListener('mousemove', this.handleMouseMove, true)
      document.documentElement.addEventListener('mouseup', this.handleMouseUp, true)
    },

    handleMouseMove (e) {
      if (this.columnResizing) {
        let offset = getOffset(this.$el)
        let d = Math.max(this.dragging_col_width + e.clientX - this.dragging_col_start_x, this.minColWidth)
        this.dragging_col_new_width = d
        this.store.states.columnPosition = e.clientX - offset.left + 5
        // this.$emit('columnresizing', e.clientX)
      }
    },

    handleMouseUp (e) {
      if (this.columnResizing) {
        this.store.states.columnResizing = false
        let oldWidth = this.dragging_col.width
        this.$set(this.dragging_col, 'width', this.dragging_col_new_width)
        document.documentElement.removeEventListener('mousemove', this.handleMouseMove, true)
        document.documentElement.removeEventListener('mouseup', this.handleMouseUp, true)
        this.$nextTick(() => {
          this.checkScroll()
          this.calWidth(this.dragging_col, this.dragging_col_new_width, oldWidth)
        })
      }
    },

    calWidth (col, newWidth, width) {
      switch (col.fixed) {
        case 'left':
          this.leftWidth += newWidth - width
          break
        case 'right':
          this.rightWidth += newWidth - width
          break
      }
    },

    // 合并字段的定义需要是一个二维数组，可以用于多组合并的定义
    combineColsIndex () {
      let index = {}
      let i
      let first = true
      let last_columns_set = []
      for(let cc of this.combineCols) {
        let last_columns = []
        last_columns_set.push(last_columns)
        i = 0
        for(let c of cc) {
          this.columns.forEach( (col, j) => {
            if (col.name === c) {
              index[j] = {index: i, last_columns: last_columns, first: first}
              ++i
              first = false
            }
          })
        }
      }
      return {index: index, last_columns_set: last_columns_set}
    },

    thStyles (col) {
      // return {textAlign: col.align || 'left'}
      let s = {textAlign: 'center'}
      if (this.fixed === 'left') {
        if (col.fixed !== 'left') {
          s['visibility'] = 'hidden'
        }
      } else if (this.fixed === 'right') {
        if (col.fixed !== 'right') {
          s['visibility'] = 'hidden'
        }
      }
      return s
    },


    handleHeaderScroll (e) {
      // this.$refs.body.scrollLeft = this.$refs.header.scrollLeft
    },

    handleBodyScroll (e) {
      this.checkScroll()
      this.$emit('scroll', this.$refs.body.scrollLeft, this.$refs.body.scrollTop)
    },

    checkScroll () {
      // 主内容才计算滚动条
      if (!this.fixed) {
        this.$refs.header.scrollLeft = this.$refs.body.scrollLeft
        this.store.states.scrollLeft = this.$refs.body.scrollLeft
        this.store.states.isScrollRight = this.$refs.body.scrollLeft && (this.$refs.body.scrollLeft + 
          this.$refs.body.clientWidth === this.$refs.content.clientWidth)
        if (this.$refs.body && this.$refs.content) {
          this.store.states.hscroll = this.$refs.body.scrollHeight > this.$refs.body.clientHeight
          this.store.states.xscroll = this.$refs.body.scrollWidth > this.$refs.body.clientWidth
        }
      }
    },

    // 单元格样式：
    //    文字对齐
    cellStyles (col) {
      let s = {textAlign: col.align || 'center', height: `${this.rowHeight}px`, overflow:'hidden'}
      if (this.fixed === 'left') {
        if (col.fixed !== 'left') {
          s['visibility'] = 'hidden'
        }
      } else if (this.fixed === 'right') {
        if (col.fixed !== 'right') {
          s['visibility'] = 'hidden'
        }
      }
      return s
    },

    /*
     * 行点击处理，如果clickSelect为true，则当前行选中
     */
    handleClick (row) {
      if (this.clickSelect && !this.static) {
        this.store.toggle(row)
      }
    },

    handleTrMouseEnter (row) {
      this.$set(row, '_hover', true)
    },

    handleTrMouseLeave (row) {
      this.$set(row, '_hover', false)
    },

    getRowId (row) {
      return row[this.idField]
    },

    // 返回列的样式
    getColumnStyle (col) {
      if (typeof col.width === 'number') {
        if (col.width > 0) {
          return {width: `${col.width}px`}
        }
        return {width: '*'}
      } else {
        return {width: `${col.width}`}
      }
    },

    handleRowEnd (el) {
      let row = this.store.states.data.splice(el.oldIndex, 1)
      this.store.states.data.splice(el.newIndex, 0, row[0])
      this.dispatch('Grid', 'on-drag', {oldIndex:el.oldIndex, newIndex:el.newIndex})
    }
  },

  mounted () {
    this.checkScroll()

    if (this.draggable) {
      let el = this.$refs.table_body
      Sortable.create(el, {
        onEnd: this.handleRowEnd
      })
    }
  }
}
</script>

<style lang="less">
.nowrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
}

.u-table {
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ccc;
  text-align: left;

  .u-table-header-wrapper {
    overflow: hidden;
    position: relative;
    background-color: #eee;

    .u-table-header-scroll {
      z-index: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-color: #eee;

      table{
        border-collapse: separate;
        border-spacing: 0;
        text-align: left;
        table-layout: fixed;
        margin: 0;
        display: table;

        &.u-table-header {
          position: relative;
          overflow: hidden;
          z-index: 1;

          th {
            position: relative;
            padding: 0;
            border: none;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
          }
        }
      }
    }

  }

  .u-table-body-scroll {
    overflow: auto;
    position: relative;

    table {
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
      table-layout: fixed;
      margin: 0;
      display: table;

      tr {
        &.selected{
          background-color:#ffefd5;
        }

        &.hover{
          background-color:#e1eff8;
        }

        td {
          position: relative;
          padding: 0;
          border: none;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .u-table-no-data {
      margin: 0 auto;
      text-align: center;
    }
  }

  &.auto-height {
    .u-table-body-scroll {
      tr:last-child td {
        border-bottom: none;
      }
    }
  }

  .u-table-header-cell-resizer {
    position: absolute;
    width:4px;
    cursor: col-resize;
    top:0px;
    right:0px;
    height: 100%;
  }
}
</style>
