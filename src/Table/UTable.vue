<template>
  <div class="u-table" :class="tableClass" :style="{width:width+'px'}" >
    <div class="u-table-header-wrapper"> <!-- Wrapper -->
      <div class="u-table-header-scroll" :style="headerScrollStyles" ref="header"
        @scroll="handleHeaderScroll"
      >
        <table cellspaceing="0" cellpadding="0" border="0" :style="{width:tableWidth+'px'}" class="u-table-header">
          <colgroup>
            <col v-for="(column, index) in columns" :style="getColumnStyle(column)" :key="column.name">
          </colgroup>
          <thead>
            <tr :style="trStyle" v-for="cols in drawColumns">
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
      <table cellspaceing="0" cellpadding="0" border="0" :style="{width:tableWidth+'px'}" ref="content">
        <colgroup>
          <col v-for="(column, index) in columns" :style="getColumnStyle(column)" :key="column.name">
        </colgroup>
        <tbody>
          <tr v-for="(row, row_index) in data"
            :style="trStyle"
            :key="getRowId(row)"
            :class="{selected:row._selected, hover:row._hover}"
            @mouseenter="handleTrMouseEnter(row)"
            @mouseleave="handleTrMouseLeave(row)"
            >
            <td v-for="(column, col_index) in columns"
              @click="handleClick(row)"
              :style="cellStyles(column)">
              <Cell :store="store" :row="row" :column="column" :row_index="row_index"></Cell>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import {Icon} from "iview"
import {measureScrollbar, mapState, getOffset, mapMethod} from '@/utils/utils.js'
import Emitter from '@/mixins/emitter.js'
import Cell from './UCell'
import HeaderCell from './UHeaderCell'

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
    fixed: String
  },

  computed: {
    ...mapState('data', 'rows', 'nowrap', 'selected', 'idField',
      'hscroll', 'xscroll', 'rowHeight', 'height', 'columnResizing',
      'clickSelect', 'checkAll', 'start', 'resizable', 'minColWidth',
      'multiSelect', 'drawColumns'
    ),

    columns () {
      return this.cols || this.store.states.columns
    },

    headerScrollStyles () {
      let style = {}
      let scrollbar = measureScrollbar()
      if (!this.fixed && this.hscroll) {
        style.marginRight = `${scrollbar}px`
        style.borderRight = '1px solid #ddd'
      }
      return style
    },

    bodyStyles () {
      let scrollbar = measureScrollbar()
      let h = this.height === 'auto' ? 'auto' : this.height + 'px'
      if (this.fixed && this.height !== 'auto' && this.xscroll) {
        h = (this.height - scrollbar) + 'px'
      }
      let options = {height: h, width: this.width + 'px'}
      return options
    },

    bodyWrapperStyles () {
      let h = this.height === 'auto' ? 'auto' : this.height + 'px'
      return {height: h}
    },

    trStyle () {
      return {height: `${this.rowHeight}px`}
    },

    // 获得序号，根据states.start 作为开始
    index () {
      this.store.states.start ++
      return this.store.states.start - 1
    }

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
        this.dragging_col.width = this.dragging_col_new_width
        this.$nextTick(() => {
          this.checkScroll()
        })
      }
    },

    thStyles (col) {
      // return {textAlign: col.align || 'left'}
      return {textAlign: 'center'}
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
        if (this.$refs.body && this.$refs.content) {
          this.store.states.hscroll = this.$refs.body.scrollHeight > this.$refs.body.clientHeight
        }
        if (this.$refs.body && this.$refs.content) {
          this.store.states.xscroll = this.$refs.body.scrollWidth > this.$refs.body.clientWidth
        }
      }
    },

    // 单元格样式：
    //    文字对齐
    cellStyles (col) {
      return {textAlign: col.align || 'left'}
    },

    /*
     * 行点击处理，如果clickSelect为true，则当前行选中
     */
    handleClick (row) {
      if (this.clickSelect) {
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
    }
  },

  mounted () {
    document.documentElement.addEventListener('mousemove', this.handleMouseMove, true)
    document.documentElement.addEventListener('mouseup', this.handleMouseUp, true)
    this.checkScroll()
  },

  beforeDestroy () {
    document.documentElement.removeEventListener('mousemove', this.handleMouseMove, true)
    document.documentElement.removeEventListener('mouseup', this.handleMouseUp, true)
  }

}
</script>

<style lang="less">
  .u-table {
      position: relative;
      overflow: hidden;
      background: #fff;
      border: 1px solid #ccc;
      text-align: left;
  }

  .u-table .nowrap {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -ms-text-overflow: ellipsis;
  }

  .u-table .u-table-header-wrapper {
    overflow: hidden;
    position: relative;
    background-color: #eee;
  }

  .u-table .u-table-header-scroll {
    z-index: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: #eee;
  }

  .u-table .u-table-body-wrapper {
    overflow: auto;
    position: relative;
  }

  .u-table .u-table-body-scroll {
    overflow: auto;
    position: relative;
  }

  .u-table .u-table-body-scroll tr.selected{
    background-color:#ffefd5;
  }

  .u-table .u-table-body-scroll tr.hover{
    background-color:#e1eff8;
  }

  .u-table .u-table-header {
      position: relative;
      overflow: hidden;
      border-top: 1px solid #eee;
      z-index: 1;
  }
  .u-table table {
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    table-layout: fixed;
  }

  .u-table-header th {
    position: relative;
    padding: 0;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #d2d2d2;
    overflow: hidden;
  }

  .u-table-body-scroll td {
    position: relative;
    padding: 0;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #d2d2d2;
    overflow: hidden;
  }

  .u-table-body-scroll > td:last-child {
    border-right: none;
  }

  .u-table-body-scroll tr:last-child > td {
    border-bottom: none;
  }

  .u-table-header-cell {
  }

  .u-table-header-cell-title {

  }

  .u-table-header-cell-resizer {
    position: absolute;
    width:4px;
    cursor: col-resize;
    top:0px;
    right:0px;
    height: 100%;
  }

</style>
