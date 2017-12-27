<template>
  <div class="u-grid-wrapper">
    <Query v-if="query" :fields="query.fields" :layout="query.layout" :show-line="query.showLine"
      :buttons="query.buttons"
      :value="query.value" @input="handleQuerySubmit"></Query>
    <div class="u-grid-tools" slot="tools">
      <div class="u-grid-tools-left" v-if="buttons.length">
        <Buttons :buttons="buttons" :data="store" :target="this"></Buttons>
      </div>
      <div class="u-grid-tools-right" v-if="rightButtons.length">
        <Buttons :buttons="rightButtons" :data="store" :target="this"></Buttons>
      </div>
    </div>
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
      <div ref="loading" class="loading" v-show="loading" v-html="loadingText" :style="loadingStyles"></div>
    </div>
    <Pagination v-if="pagination" :store="store"
      @on-page="handlePage"
      @on-page-size="handlePageSize">
      <Buttons :buttons="bottomButtons" :target="this" :data="store"></Buttons>
    </Pagination>
  </div>
</template>

<script>
import UTable from './UTable'
import Store from './UGridStore'
import Pagination from './pagination'
import Buttons from './UButtons'
import {mapState, mapMethod, copyDataRow} from '@/utils/utils.js'
import Emitter from '@/mixins/emitter.js'
import Query from '../query'

export default {
  name: 'Grid',
  mixins: [ Emitter ],

  components: {
    UTable,
    Pagination,
    Buttons,
    Query
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
      'pagination', 'loading', 'loadingText', 'loadingTop', 'loadingLeft',
      'autoLoad', 'url', 'param', 'buttons', 'rightButtons', 'bottomButtons',
      'selected', 'editMode', 'actionColumn', 'deleteRowConfirm',
      'onSaveRow', 'onDeleteRow', 'onLoadData', 'query'
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
    },

    loadingStyles () {
      return {top: `${this.loadingTop}px`, left: `${this.loadingLeft}px`}
    }
  },

  methods: {
    ...mapMethod('getSelection', 'showLoading', 'setSelection', 'removeRow',
      'setComment', 'removeComment'),

    resize () {
      if (this.width === 'auto') {
        this.store.states.gridWidth = this.$el.clientWidth
      } else {
        this.store.states.gridWidth = this.width
      }

      // if (!this.resizable) return
      // let parentWidth = this.$el.clientWidth
      let cols = []
      let w = this.gridWidth
      let hasLeftFixed = false
      let max_level = 0

      for (let col of this.columns) {
        col.subs = col.title.split('/')
        max_level = Math.max(max_level, col.subs.length)
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
          if (col.type === 'check' || col.type === 'index' || col.fixed === 'left') {
            leftCols.push(col)
            this.store.states.leftWidth += col.width
          } else {
            restCols.push(col)
          }
        }
        this.store.states.columns = leftCols.concat(restCols)
      }
      this.store.states.drawColumns = this.parse_header(this.columns, max_level)
    },

    parse_header (cols, max_level) {
      let columns = [], //保存每行的最后有效列
        columns_width = {}, //保存每行最右坐标
        i, len, j, jj, col, jl,
        subs_len,
        path,
        rowspan, //每行平均层数，max_level/sub_len，如最大4层，当前总层数为2,则每行占两层
        colspan,
        parent, //上一层的结点为下一层的父结点
        new_col, //记录显示用的表头单元
        left  //某层最左结点

      if (!cols || cols.length === 0)
        return []

      //初始化表头层
      for (i = 0; i < max_level; i ++) {
        columns[i] = []
        columns_width[i] = 0
      }
      //处理多级表头
      for(let col of cols) {
        subs_len = col.subs.length
        rowspan = 1//Math.floor(max_level / subs_len)
        for (j=0; j<subs_len; j++) {
          path = col.subs[j]
          new_col = Object.assign({}, col)
          new_col.title = path.replace('%%', '/')
          new_col.level = j
          new_col.colspan = 1
          new_col.col = col
          if (j == subs_len - 1) {
            //如果是最后一层，则rowspan为最大值减其余层
            new_col.rowspan = max_level - (subs_len-1)*rowspan
            new_col.leaf = true
          } else {
            new_col.rowspan = rowspan
          }

          //查找同层最左边的结点，判断是否title和rowspan一致
          //如果一致，进行合并，即colspan +1
          //如果不一致，则插入新的结点
          //对于一层以下的结点，还要看上一层是否同一个结点，如果是才合并，否则插入
          if (columns[j].length > 0)
            left = columns[j][columns[j].length-1]
          else {
            left = null
          }

          //进行合并的判断，当left不为null，并且标题，层级，并且位置小于当前位置
          if (left && left.title === new_col.title && left.level === new_col.level) {
            left.colspan ++
            left.width += new_col.width
            columns_width[j] += new_col.width
            // left.leaf = false
          } else {
            //当new_col占多行时，将下层结点清空
            columns[j].push(new_col)
            new_col.left = columns_width[j]
            columns_width[j] += new_col.width
            for (jl=1; jl<new_col.rowspan; jl++) {
              columns_width[j+jl] += new_col.width
            }
          }
          col.left = new_col.left
        }
      }
      return columns
    },

    getDefaultColumn (options) {
      return Object.assign({
        name: 'title',
        width: 0,
        sortable: false,
        align: 'center',
        hidden: false,
        fixed: '',
        resizable: true,
        type: 'column',
        editorOptions: {}
      }, options || {})
    },

    getDefaultRow (row) {
      return Object.assign({
        _selected: false,
        _hover: false,
        _selectable: true, // 可被选中
        _checkable: true, // 可显示checkbox
        _editting: false
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

      this.data.columns.forEach(col => {
        if (!col.hidden) {
          let d = this.getDefaultColumn()
          // 增加行编辑操作列的render函数
          if (this.editMode === 'row' && col.name === this.actionColumn) {
            d.render = this.editActionRender
          }
          if (!d.title) d.title = d.name
          Object.assign(d, col)
          cols.push(d)
        }
      })

      return cols
    },

    makeRows (data) {
      var rows = []
      data.forEach(row => {
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
    },

    handlePage (page) {
      this.$nextTick( () => {
        this.$set(this.store.states.param, 'page', page)
        this.loadData()
      })
    },

    handlePageSize (size) {
      this.$nextTick( () => {
        this.$set(this.store.states.param, 'pageSize', size)
        this.loadData()
      })
    },

    // 生成缺省的行编辑按钮
    editActionRender (h, param) {
      return h('div', {
        'class': 'u-cell-text'
      },
      [
        this.defaultEditRender(h, param.row),
        this.defaultDeleteRender(h, param.row)
      ])
    },

    defaultEditRender (h, row) {
      return h('Button', {
        props: {
          type: 'primary',
          size: 'small',
          loading: row._saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            click: () => {
              if (!row._editting) {
                this.$set(row, '_editRow', Object.assign({}, row))
                this.$set(row, '_editting', true)
              } else {
                this.$set(row, '_saving', true)
                if (this.onSaveRow) {
                  let callback = (flag, data) => {
                    if (flag === 'ok') {
                      copyDataRow(row, row._editRow)
                      this.removeComment(row)
                      this.$set(row, '_editting', !row._editting)
                      delete row._editRow
                    } else {
                      for(let key in data) {
                        let v = data[key]
                        this.setComment(row, key, v, 'error')
                      }
                    }
                    this.$set(row, '_saving', false)
                  }
                  this.onSaveRow.call(this, row._editRow, callback)
                } else {
                  copyDataRow(row, row._editRow)
                  delete row._editRow
                  this.$set(row, '_editting', false)
                  this.$set(row, '_saving', false)
                }
              }
            }
        }
      }, row._editting ? '保存' : '编辑')
    },

    defaultDeleteRender (h, row) {
      let defaultDeleteFunc = () => {
        if (row._editting) {
          this.$set(row, '_editting', false)
          this.$delete(row, '_editRow')
          if (row._new) {
            this.removeRow(row)
          }
          return
        }

        let callback = (flag, data) => {
          if (flag === 'ok') {
            this.removeRow(row)
          } else {
            for(let key in data) {
              let v = data[key]
              this.setComment(row, key, v, 'error')
            }
            this.$set(row, '_deleting', false)
          }
        }
        if (this.onDeleteRow){
          this.onDeleteRow(row, callback)
        } else {
          this.removeRow(row)
        }
      }

      let type = row._editting ? 'default' : 'error'

      return h('Button', {
        style: {
          margin: '0 5px'
        },
        props: {
          type: type,
          placement: 'top',
          size: 'small',
          loading: row._deleting
        },
        on: {
          click: () => {
            if (this.deleteRowConfirm && !row._editting) {
              this.$Modal.confirm({
                content: '请确认是否要删除本条记录？',
                onOk: () => {
                  defaultDeleteFunc()
                }
              })
            } else {
              defaultDeleteFunc()
            }
          }
        }
      }, row._editting ? '取消' : '删除')
    },

    loadData (url) {
      let _url = url || this.url
      let param = this.param
      // data 为数据行， others 为其它信息，如total
      let callback = (data, others) => {
        this.store.states.data = this.makeRows(data)
        if (others && (others instanceof Object)) {
          this.store.mergeStates(others)
        }
        this.$nextTick( () => {
          this.showLoading(false)
          this.setSelection(this.selected)
        })
      }
      if (this.onLoadData) {
        this.showLoading(true)
        this.onLoadData(_url, param, callback)
      }
    },

    handleQuerySubmit (data) {
      this.store.states.param = Object.assign(this.param, data)
      this.$set(this.store.states, 'page', 1)
      this.$set(this.store.states.param, 'page', 1)
      this.loadData()
    }
  },

  created () {
    this.store.states.columns = this.makeCols()
    this.store.states.data = this.makeRows(this.store.states.data)
  },

  mounted () {
    this.resize()
    window.addEventListener('resize', this.handleResize, true)

    if (this.autoLoad) {
      this.$nextTick( () => {
        this.loadData()
      })
    }
  },

  watch: {
    'data.columns': {
      handler: function () {
        this.store.states.columns = this.makeCols()
        this.resize()
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.ivu-btn-group {
  margin-right:3px;
}

label {
  margin-bottom: 0px;
}

.u-grid-wrapper {

  .u-grid-tools {
    margin-bottom: 5px;

    &:after {
      content: "";
      display: block;
      height: 0;
      clear: both;
      overflow: hidden;
      visibility: hidden
    }

    .u-grid-tools-left {
      float: left!important;
    }

    .u-grid-tools-right {
      float: right!important;
    }
  }

  .u-grid {
    position: relative;
    font-size: 14px;

    > .column-dragger-guide {
      height: 100%;
      top: 0px;
      left: 0px;
      border-left: 2px dashed green;
      position: absolute;
      z-index: 1000;
    }

    > .loading {
      position: absolute;
      margin: auto;
      height: 34px;
      text-align: center;
      color: black;
      line-height: 34px;
      border: 1px solid gray;
      width: 100px;
      background-color: antiquewhite;
      z-index: 9999;
    }

    .u-table-left {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      overflow: hidden;
      border-right: none;
      border-bottom: none;

      &.dark {
        box-shadow: 1px 0px 2px #999;
      }

      .u-table-body-scroll {
        overflow: hidden;
      }
    }
  }
}
</style>
