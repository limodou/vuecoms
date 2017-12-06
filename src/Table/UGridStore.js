import List from '@/utils/list.js'

class Store {
  constructor (grid, options) {
    this.grid = grid
    this.states = {
      columns: [],
      rowHeight: 34,
      minColWidth: 5,
      defaultColWidth: 100,
      nowrap: false,
      width: 'auto',
      height: 'auto',
      gridWidth: 0,
      checkCol: false,
      checkColWidth: 30,
      checkColTitle: '',
      idField: 'id',
      data: [],
      multiSelect: false,
      clickSelect: false,  // 点击选中
      resizable: true, // 是否表头列可以调整大小
      draggable: false,
      indexCol: false, // 是否显示序号列
      indexColTitle: '#',
      indexColWidth: 40,
      loadingText: '<i class="icon-loading ivu-icon ivu-icon-load-c"></i> Loading...', // 正在装入时显示的文本
      autoLoad: true, // 是否自动装入数据
      url: '', // 访问后台的URL
      param: {
      }, // 访问后台的URL所带参数，可以是函数
      buttons: [],
      rightButtons: [],
      bottomButtons: [],
      comments: {}, // 记录单元格的注释，形式为 {row_id: {col_name:comment}}
      combineCols: [], // 单元格合并列名
      editMode: '', // 编辑模式 'full' 全屏模式 'row' 行模式
      actionColumn: '', // 行编辑时，显示编辑按钮的列名,将缺省显示['编辑', '删除']
      deleteRowConfirm: true, // 删除前是否先确认

      // 回调
      onLoadData: null, // 装入数据回调函数，将传入 function (url, param, callback)
      onSelect: null, // 在选择行前执行，返回为True，则允许选中
      onDeselect: null, // 在取消选择行前执行，返回为True，则允许取消选中
      onCheckable: null, // 是否显示checkbox
      onSaveRow: null, // 保存行时调用 function (row, callback), callback(flag, data)
                       // flag 为 'ok'表示成功，data 为最后的数据 'error'表示有错误, data为出错信息
      onSaveCol: null,  // 保存单元格时调用 function (value, callback), callback(flag, data)
                        // flag 为 'ok'表示成功，data 为最后的数据 'error'表示有错误, data为出错信息
      onDeleteRow: null,// 删除行的确认 function (row, callback), callback(flag, data)

      // 内部变量
      drawColumns: [], // 用于绘制的表头
      columnResizing: false,
      columnPosition: 0,
      checkAll: false,
      fixedColumns: [],
      leftWidth: 0, // 左则固定列宽度
      hscroll: false,
      xscroll: false,
      scrollLeft: 0, // 记录横向滚动条偏移量，用于显示左侧固定列的特殊样式
      guiderHeight: 0, // 拖动指示器的高度
      loading: false, // 是否显示loading信息
      loadingLeft: 0,
      loadingTop: 0,
      selected: {}, // 记录选中结果，可以跨页保存

      // 分页相关参数
      prev: '上一页',
      next: '下一页',
      first: '',
      last: '',
      start: 1,
      total: 0,       // 总条数
      pageSizeOpts: [10, 20, 30, 40, 50], // 每页条数选项
      pagination: false, // 是否显示分页信息，缺省为 false
      page: 1,
      pageSize: 10
    }

    for (let name in options) {
      if (options.hasOwnProperty(name) && this.states.hasOwnProperty(name)) {
        this.states[name] = options[name]
      }
    }

    // 初始化states.param
    this.states.param.page = this.states.page
    this.states.param.pageSize = this.states.pageSize

    if (!grid) {
      throw new Error('Grid object is Required.')
    }
  }

  selected (row) {
    return row._selected
  }

  toggle (row) {
    if (row._selected) this.deselect(row)
    else this.select(row)
  }

  _select (row) {
    let selectable = true
    if (this.states.onSelect) {
      selectable = this.states.onSelect(row)
    }
    this.grid.$set(row, '_selected', selectable)
    if (selectable) {
      this.grid.$set(row, '_selected', true)
      let id = row[this.states.idField]
      this.grid.$set(this.states.selected, id, id)
    }
  }

  select (row) {
    if (!this.states.multiSelect) this.deselectAll()
    this._select(row)
    this.grid.$emit('on-selected', row)
  }

  selectAll () {
    this.states.data.forEach(row => {
      this._select(row)
    })
    this.grid.$emit('on-selected-all')
  }

  _deselect (row) {
    let deselectable = true
    if (this.states.onDeselect) {
      deselectable = this.states.onDeselect(row)
    }
    this.grid.$set(row, '_deselected', deselectable)
    if (deselectable) {
      this.grid.$set(row, '_selected', false)
      this.grid.$delete(this.states.selected, row[this.states.idField])
    }
  }

  deselect (row) {
    this._deselect(row)
    this.grid.$emit('on-deselected', row)
  }

  deselectAll () {
    this.states.data.forEach(row => {
      this._deselect(row)
    })
    this.grid.$emit('on-deselected-all')
  }

  getSelection () {
    return Object.values(this.states.selected)
  }

  setSelection (selection) {
    for(let row of this.states.data) {
      let id = row[this.states.idField]
      if (this.states.selected.hasOwnProperty(id)) {
        this.grid.$set(row, '_selected', true)
      }
    }
  }

  showLoading (loading=true, text='') {
    this.states.loading = loading
    if (text) {
      this.states.loadingText = text
    }
    if (loading) {
      this.states.loadingTop = this.grid.$refs.table.$el.clientHeight/2-this.states.rowHeight/2
      this.states.loadingLeft = this.grid.$refs.table.$el.clientWidth/2-100/2
    }
  }

  removeRow (row) {
    List.remove(this.states.data, row)
  }

  getComment (row, column) {
    let key, col
    if (typeof row === 'object') {
      key = row[this.states.idField]
    } else {
      key = row
    }
    if (typeof column === 'object') {
      col = column.name
    } else {
      col = column
    }
    let r = this.states.comments[key]
    if (!r) return ''
    return r[col]
  }

  setComment (row, column, content, type='info') {
    let key, col
    if (typeof row === 'object') {
      key = row[this.states.idField]
    } else {
      key = row
    }
    if (typeof column === 'object') {
      col = column.name
    } else {
      col = column
    }
    let r = this.states.comments[key]
    if (!r) {
      r = this.grid.$set(this.states.comments, key, {})
    }
    this.grid.$set(r, col, {content:content, type:type})
  }

  removeComment (row, column) {
    let key, col
    if (typeof row === 'object') {
      key = row[this.states.idField]
    } else {
      key = row
    }
    if (typeof column === 'object') {
      col = column.name
    } else {
      col = column
    }
    let r = this.states.comments[key]
    if (r) {
      if (!col) {
        delete this.states.comments[key]
      } else {
        delete r[col]
      }
    }
  }

}


export default Store
