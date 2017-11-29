<template>
  <div class="u-cell">
    <template v-if="column.type === 'column'">
      <div class="u-cell-text" :class="{nowrap:nowrap}"
      v-html="getCellValue(column, row)"></div>
    </template>
    <template v-if="column.type === 'check'">
      <i v-if="row._selected" class="ivu-icon ivu-icon-android-checkbox-outline u-cell-checkbox" @click.stop="handleCheckClick(row)"></i>
      <i v-else class="ivu-icon ivu-icon-android-checkbox-outline-blank u-cell-checkbox" @click.stop="handleCheckClick(row)"></i>
    </template>
    <span v-if="column.type === 'index'">
      {{ colIndex(row_index) }}
    </span>
  </div>
</template>

<script>
import {mapState} from '@/utils/utils.js'

export default {
  name: 'Cell',
  props: {
    row: Object,
    column: Object,
    store: Object,
    row_index: Number
  },

  computed: mapState('nowrap'),

  methods: {
    colIndex (index) {
      return this.start + index
    },

    handleCheckClick (row) {
      this.store.toggle(row)
    },

    getCellValue (column, row) {
      let value = row[column.name]
      if (column.format) {
        value = column.format(value, column, row)
      }
      return value
    }
  }
}
</script>

<style lang="less">
.u-cell {
  width: 100%;
  height: 100%;
  position: relative;

  .u-cell-text {
    padding: 0 5px;
  }
  
  .u-cell-checkbox {
    cursor: pointer;
  }
}
</style>
