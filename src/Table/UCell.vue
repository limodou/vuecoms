<template>
  <div class="u-cell">
    <CellRender v-if="columnType === 'render'"
      :row="col.row" :render="col.column.render" :column="col.column"
      :value="col.value"></CellRender>
    <template v-if="columnType === 'normal'">
      <div class="u-cell-text" :class="{nowrap:nowrap}"
      v-html="value"></div>
    </template>
    <CellEditor v-if="columnType === 'editor'"
      :col="col"
      :display="value"
      :row="col.row"
      :nowrap="nowrap"
      :editor-options="col.column.editorOptions"

      :column="col.column"></CellEditor>
    <template v-if="columnType === 'check' && checkable">
      <i v-if="col.row._selected" class="ivu-icon ivu-icon-android-checkbox-outline u-cell-checkbox" @click.stop="handleCheckClick"></i>
      <i v-else class="ivu-icon ivu-icon-android-checkbox-outline-blank u-cell-checkbox" @click.stop="handleCheckClick"></i>
    </template>
    <span v-if="columnType === 'index'">
      {{ index }}
    </span>
  </div>
</template>

<script>
import {mapState} from '@/utils/utils.js'
import CellRender from './UCellRender'
import CellEditor from './UCellEditor'

export default {
  name: 'Cell',
  props: {
    col: Object,
    store: Object,
    row_index: Number
  },

  components: {
    CellRender,
    CellEditor
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

    columnType () {
      let type = this.col.column.type
      if (type === 'index') return 'index'
      if (type === 'check') return 'check'
      if (type === 'column') {
        if (this.col.column.render) return 'render'
        if (this.col.column.editor) return 'editor'
        return 'normal'
      }
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
