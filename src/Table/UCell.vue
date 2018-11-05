<template>
  <div class="u-cell" :class="classes">
    <div class="u-cell-wrap" :style="cellWrapStyles">
      <span v-if="tree && treeField===col.column.name && col.row[isParentField]" 
        class="u-cell-tree-field-icon" 
        :style="iconStyles"
        @click="handleExpandClick">
        <i :class="openedIcon" v-if="!col.row._loading && (col.row[expandField] || defaultExpanded)" style="font-size:18px"></i>
        <i :class="closedIcon" v-if="!col.row._loading && !col.row[expandField]" style="font-size:18px"></i>
        <i v-if="col.row._loading" class="ivu-icon ivu-icon-ios-loading ivu-load-loop"></i>
      </span>
      <CellRender v-if="columnType === 'render'"
        :row="col.row" :render="col.column.render" :column="col.column"
        :value="col.value"></CellRender>
      <div v-if="col.column.html && columnType === 'normal' && col.column.showTitle" v-html="value" :title="value" class="u-cell-text" :class="{nowrap:nowrap}"></div>
      <div v-if="col.column.html && columnType === 'normal' && !col.column.showTitle" v-html="value" class="u-cell-text" :class="{nowrap:nowrap}"></div>
      <div v-if="!col.column.html && columnType === 'normal' && col.column.showTitle" :title="value" class="u-cell-text" :class="{nowrap:nowrap}">{{value}}</div>
      <div v-if="!col.column.html && columnType === 'normal' && !col.column.showTitle" class="u-cell-text" :class="{nowrap:nowrap}">{{value}}</div>
      <GenericInput v-if="columnType === 'editor'" 
        v-bind="col.column.editor"
        :name="col.column.name"
        :format="col.column.format"
        :value="savingRow || col.row"
        :static="col.column.editor.static || !col.row._editting"
        :show-title="col.column.showTitle"
        :classes="nowrap ? 'nowrap' : ''"
      >
      </GenericInput>
      <template v-if="columnType === 'check' && checkable">
        <i v-if="col.row._selected" class="ivu-icon ivu-icon-ios-checkbox-outline u-cell-checkbox" @click.stop="handleCheckClick"></i>
        <i v-else class="ivu-icon ivu-icon-ios-square-outline u-cell-checkbox" @click.stop="handleCheckClick"></i>
      </template>
      <span v-if="columnType === 'index'" :class="{nowrap:nowrap}">
        {{ index }}
      </span>
    </div>
    <span v-if="comment" class="u-cell-comment"
      :class="comment.type" :title="comment.content"
      ></span>
  </div>
</template>

<script>
import {mapState, mapMethod} from '@/utils/utils.js'
import CellRender from './UCellRender'
import GenericInput from '../Fields/GenericInput'
import List from '@/utils/list.js'

export default {
  name: 'Cell',
  props: {
    col: Object,
    store: Object,
    row_index: Number
  },

  components: {
    CellRender,
    GenericInput
  },

  computed: {
    ...mapState('nowrap', 'start', 'editRow', 'editMode', 'onCheckable', 'cellTitle',
      'tree', 'treeField', 'iconWidth', 'indentWidth', 'expandField', 'openedIcon',
      'closedIcon', 'isParentField', 'defaultExpanded', 'onLoadData', 'url', 'selected',
      'idField'
    ),
    value () {
      let value = this.col.value
      if (this.col.column.format) {
        value = this.col.column.format(value, this.col.column, this.col.row)
      }
      return value
    },

    comment () {
      return this.getComment(this.col.row, this.col.column)
    },

    classes () {
      return this.getClass(this.col.row, this.col.column)
    },

    index () {
      return this.start + this.row_index
    },

    /*
     * 根据编辑模式不同，选择数据保存的row
     */
    savingRow () {
      if (this.editMode === 'row') return  this.col.row._editRow
      else return this.col.row
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
      let c = this.col.row._checkable === undefined ? true : this.col.row._checkable
      if (this.onCheckable) {
        c = this.onCheckable(this.col.row)
        this.$set(this.col.row, '_checkable', c)
      }
      return c
    },

    iconStyles () {
      let s = {}
      if (this.tree && this.treeField === this.col.column.name) {
        let level = this.col.row._level || 0
        let left = 0
        if (level) {
          left = level * this.indentWidth
        }
        s.left = `${left}px`
        s.width = `${this.iconWidth}px`
      }
      return s
    },

    // 计算tree单元格缩近宽度
    cellWrapStyles () {
      let s = {}
      if (this.tree && this.treeField === this.col.column.name) {
        let level = this.col.row._level || 0
        let left = 0
        if (level) {
          left = level * this.indentWidth
        }
        s.paddingLeft = `${left + this.iconWidth}px`
      }
      return s
    }
  },

  methods: {
    ...mapMethod('getComment', 'getClass', 'setSelection', 'makeRows'),
    handleCheckClick () {
      this.store.toggle(this.col.row)
    },
    handleExpandClick () {
      let expand = !(this.col.row[this.expandField] || this.defaultExpanded)
      if (expand && this.col.row[this.isParentField]) {
        if (!this.col.row['_loaded']) {
          let callback = (data, others) => {
            //转换数据
            let rows = []
            if (data) {
              rows = this.makeRows(data)
              //插入数据
              List.add(this.store.states.data, rows, this.row_index)
              //合并其它值
              if (others && (others instanceof Object)) {
                this.store.mergeStates(others)
              }
            }
            //更新
            this.$nextTick( () => {
              this.$set(this.col.row, '_loading', false)
              this.$set(this.col.row, '_loaded', true)
              this.setSelection(this.selected)
              this.$set(this.col.row, this.expandField, expand)
              this.$emit('expanded', this.col.row[this.expandField], this.col.row)
            })
          }
          if (this.onLoadData) {
            this.$set(this.col.row, '_loading', true)
            this.$nextTick( () => {
              this.onLoadData(this.url, {parent:this.col.row[this.idField], row: this.col.row}, callback)
            })
            return
          }
        }
      }
      this.$set(this.col.row, this.expandField, expand)
      this.$emit('expanded', this.col.row[this.expandField], this.col.row)
    }
  }
}
</script>

<style lang="less">
.u-cell {
  width: 100%;
  height: 100%;
  position: relative;
  display: table;

  .u-cell-wrap {
    width: 100%;
    max-width: 0px;
    padding: 0;
    vertical-align: middle;
    display: table-cell
  }

  .u-cell-text {
    padding: 0 5px;
    word-wrap: break-word;
  }

  .u-cell-checkbox {
    cursor: pointer;
  }

  .u-cell-comment {
    border: 4px solid;
    border-color: transparent transparent transparent transparent;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 5000;

    &.error {
      border-color: #b94a48 #b94a48 transparent transparent;
    }

    &.warning{
        border-color: #f89406 #f89406 transparent transparent;
    }

    &.success{
        border-color: #468847 #468847 transparent transparent;
    }

    &.info{
        border-color: #3a87ad #3a87ad transparent transparent;
    }

    &.changed{
        border-color: #f00 #f00 transparent transparent;
    }
  }

  .u-cell-tree-field-icon {
    position: absolute;
    color: #777;
    cursor: pointer;
    // top: 50%;
    // transform: translate(0,-50%);
    text-align: right;
  }
}
</style>
