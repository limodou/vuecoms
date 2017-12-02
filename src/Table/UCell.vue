<template>
  <div class="u-cell">
    <template v-if="col.column.type === 'column'">
      <div class="u-cell-text" :class="{nowrap:nowrap}"
      v-html="value"></div>
    </template>
    <template v-if="col.column.type === 'check' && checkable">
      <i v-if="col.row._selected" class="ivu-icon ivu-icon-android-checkbox-outline u-cell-checkbox" @click.stop="handleCheckClick"></i>
      <i v-else class="ivu-icon ivu-icon-android-checkbox-outline-blank u-cell-checkbox" @click.stop="handleCheckClick"></i>
    </template>
    <span v-if="col.column.type === 'index'">
      {{ index }}
    </span>
  </div>
</template>

<script>
import {mapState} from '@/utils/utils.js'

export default {
  name: 'Cell',
  props: {
    col: Object,
    store: Object,
    row_index: Number
  },

  computed: {
    ...mapState('nowrap', 'start'),
    value () {
      let value = this.col.value
      if (this.col.column.format) {
        value = this.col.column.format(value, this.col.column, this.col.row)
      }
      return value
    },

    index () {
      return this.start + this.row_index
    },

    checkable () {
      let c = this.col.row._checkable
      if (this.store.grid.onCheckable) {
        c = this.store.grid.onCheckable(this.col.row)
        this.$set(this.col.row, '_checkable', c)
      }
      return c
    }
  },

  methods: {
    handleCheckClick () {
      this.store.toggle(this.col.row)
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
