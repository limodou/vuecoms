<template>
  <div class="u-header-cell">
    <div v-if="column.type === 'column'" class="u-table-header-header-cell" :style="trStyles(column)">

      <div class="u-table-header-cell-title" :class="{nowrap:nowrap}" v-html="column.title"></div>

      <Sort v-if="column.sortable && column.leaf" :store="store" :column="column"></Sort>

      <div v-if="resizable && column.resizable && column.leaf" class="u-table-header-cell-resizer"
        @mousedown.stop.prevent="handleMouseDown(column, $event)">
      </div>

    </div>

    <div v-if="column.type === 'check'">
      <template v-if="multiSelect">
        <i v-if="checkAll" class="ivu-icon ivu-icon-ios-checkbox-outline u-cell-checkbox" @click.stop="handleCheckAll"></i>
        <i v-else class="ivu-icon ivu-icon-ios-square-outline u-cell-checkbox" @click.stop="handleCheckAll"></i>
      </template>
      <span v-if="column.title">{{column.title}}</span>
    </div>

    <div v-if="column.type === 'index'">
      <span v-if="column.title">{{column.title}}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from '../utils/utils.js'
import Sort from './USort'

export default {
  name: 'Cell',
  props: {
    column: Object,
    store: Object
  },
  components: {
    Sort
  },

  computed: {
    ...mapState('nowrap', 'resizable', 'multiSelect', 'checkAll', 'rowHeight', 'static')
  },

  methods: {
    handleCheckAll () {
      if (this.static) return
      this.store.states.checkAll = !this.store.states.checkAll
      if (this.checkAll) {
        this.store.selectAll()
      } else {
        this.store.deselectAll()
      }
    },

    handleMouseDown (column, e) {
      this.$parent.handleMouseDown(column.col, e)
    },

    trStyles (column) {
      if (!this.nowrap) {
        return {}
      } else {
        let h = `${column.rowspan * this.rowHeight}px`
        return {height: h, lineHeight: h}
      }
    }
  }
}
</script>

<style lang="less">
.u-header-cell {
  width: 100%;
  height: 100%;
  position: relative;

  .u-cell-checkbox {
    cursor: pointer;
  }

  .u-table-header-cell-title {
    padding: 0 5px;
  }
}
</style>
