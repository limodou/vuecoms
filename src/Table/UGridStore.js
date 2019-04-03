import List from '../utils/list.js'
import {uuid, walkTree, isEmpty} from '../utils/utils.js'
import VueScrollTo from 'vue-scrollto'

let rowKey = 1

class Store {
  constructor (grid, options, value) {
    this.grid = grid
    this.states = {
      columns: [],
      rowHeight: 34,
      minColWidth: 5,
      defaultColWidth: 100,
      nowrap: false,
      width: 'auto',
      height: 'auto',
      theme: 'default', // 表格theme
      gridWidth: 0,
      checkCol: false,
      checkColWidth: 30,
      checkColTitle: '',
      cellTitle: true, // 单元格显示title属性
      idField: 'id',
      static: false, // 是否静态，如果true，则行编辑将禁止，不能进行行选择，可以执行setSelection()
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
      parseUrl: true, // 是否从URL解析查询参数
      url: '', // 访问后台的URL
      param: {
      }, // 访问后台的URL所带参数
      buttons: [],
      rightButtons: [],
      bottomButtons: [],
      comments: {}, // 记录单元格的注释，形式为 {row_id: {col_name:comment}}
      classes: {}, // 记录单元格的class
      combineCols: [], // 单元格合并列名
      editMode: 'row', // 编辑模式 'full' 全屏模式 'row' 行模式
      actionColumn: '', // 行编辑时，显示编辑按钮的列名,将缺省显示['编辑', '删除']
      deleteRowConfirm: true, // 删除前是否先确认
      query: null, // 查询条件对象
      noData: '暂无数据', //无数据时显示内容
      noDataHeight: 40, //无数据显示的高度
      // addAutoScrollTo: true, //行编辑在添加新行时，自动滚动到新加行
      detectParentResize: true,

      // tree 相关的参数
      tree: false, // 是否treegrid
      defaultExpanded: false, // 缺省折叠状态
      treeField: '', // 展示树结构的列名
      expandField: '_expand', // 标识折叠状态列名
      childrenField: 'children', // 子结点列名
      openedIcon: 'ivu-icon ivu-icon-md-arrow-dropdown', // 树结点展开的图标
      closedIcon: 'ivu-icon ivu-icon-md-arrow-dropright',
      indentWidth: 20, // 子结点缩近宽度
      iconWidth: 14, // icon所占宽度
      hoverRowKey: null, // hover时的rowKey

      // 回调
      onLoadData: null, // 装入数据回调函数，将传入 function (url, param, callback)，当树型结构时，会传入parent字段
      onSelect: null, // 在选择行前执行，返回为True，则允许选中
      onDeselect: null, // 在取消选择行前执行，返回为True，则允许取消选中
      onCheckable: null, // 是否显示checkbox
      onSaveRow: null, // 保存行时调用 function (row, callback), callback(flag, data)
                       // flag 为 'ok'表示成功，data 为最后的数据 'error'表示有错误, data为出错信息
      onSaveCol: null,  // 保存单元格时调用 function (value, callback), callback(flag, data)
                        // flag 为 'ok'表示成功，data 为最后的数据 'error'表示有错误, data为出错信息
      onDeleteRow: null,// 删除行的确认 function (row, callback), callback(flag, data)
      onRowEditRender: null, // 判断某行编辑列重定义 function (h, row) 返回 null 表示使用缺省的编辑render，
                              // 否则应返回一个自定义的render, h为create函数

      // 内部变量
      drawColumns: [], // 用于绘制的表头
      columnResizing: false,
      columnPosition: 0,
      checkAll: false,
      fixedColumns: [],
      leftWidth: 0, // 左侧固定列宽度
      rightWidth: 0, // 右侧固定列宽度
      hscroll: false,
      xscroll: false,
      scrollLeft: 0, // 记录横向滚动条偏移量，用于显示左侧固定列的特殊样式
      isScrollRight: false,
      guiderHeight: 0, // 拖动指示器的高度
      loading: false, // 是否显示loading信息
      selected: {}, // 记录选中结果，可以跨页保存
      selectedRows: {},

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

    if (value && value.length > 0) {
      this.states['data'] = value
    }

    this.setParam(options.param)

    // 初始化states.param
    this.states.param.page = this.states.page
    this.states.param.pageSize = this.states.pageSize

    if (!grid) {
      throw new Error('Grid object is Required.')
    }
  }

  selected (row) {
    let id = row[this.states.idField] || row._rowKey
    return this.states.selected[id]
  }

  toggle (row) {
    if (this.selected(row)) this.deselect(row)
    else this.select(row)
  }

  _select (row) {
    let selectable = true
    if (this.states.onSelect) {
      selectable = this.states.onSelect(row)
    }
    if (selectable) {
      let id = row[this.states.idField] || row._rowKey
      this.grid.$set(this.states.selected, id, id)
      this.grid.$set(this.states.selectedRows, id, row)
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
    let id = row[this.states.idField] || row._rowKey
    if (deselectable) {
      this.grid.$delete(this.states.selected, id)
      this.grid.$delete(this.states.selectedRows, id)
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
    this.states.selected = {}
    this.grid.$emit('on-deselected-all')
  }

  getSelection () {
    return Object.values(this.states.selected)
  }

  getSelectedRows () {
    return Object.values(this.states.selectedRows)
  }

  setSelection (selection) {
    // if (Array.isArray(selection)) {
    //   for(let c of selection) {
    //     this.grid.$set(this.states.selected, c, c)
    //   }  
    // } else {
    //   this.grid.$set(this.states, 'selected', selection)
    // }
    if (isEmpty(selection)) return
    let index, s
    if (Array.isArray(selection)) {
      s = selection.slice()
    } else if (selection instanceof Object) {
      s = []
      for (let c in selection) {
        s.push(c)
      }
    } else {
      s = [selection]
    }
    const callback = (row) => {
      let id = row[this.states.idField]
      index = s.indexOf(id)
      if (index > -1) {
        this._select(row)
        s.splice(index, 1, 1)
      }
      if (s.length === 0) return true
    }
    walkTree(this.states.data, callback)

    // 处理剩余数据
    for(let c of s) {
      this.grid.$set(this.states.selected, c, c)
    }
  }

  showLoading (loading=true, text='') {
    this.states.loading = loading
    if (text) {
      this.states.loadingText = text
    }
  }

  //编辑完成后， 发送事件
  sendInputEvent () {
    this.grid.$emit('input', this.states.data)
  }

  removeRow (row) {
    let d
    if (!row._parent) d = this.states.data
    else d = row._parent[this.states.childrenField]
    let removed = List.remove(d, row, '_rowKey')
    for(let i of removed) {
      this.deselect(i)
      this.states.total -= 1
    }
  }

  getKey (row, column) {
    let key, col
    if (typeof row === 'object') {
      key = row._rowKey
    } else {
      key = row
    }
    if (typeof column === 'object') {
      col = column.name
    } else {
      col = column
    }
    return {key, col}
  }


  getComment (row, column) {
    let {key, col} = this.getKey(row, column)
    let r = this.states.comments[key]
    if (!r) return ''
    return r[col]
  }

  setComment (row, column, content, type='info') {
    let {key, col} = this.getKey(row, column)
    let r = this.states.comments[key]
    if (!r) {
      r = this.grid.$set(this.states.comments, key, {})
    }
    this.grid.$set(r, col, {content:content, type:type})
  }

  removeComment (row, column) {
    let {key, col} = this.getKey(row, column)
    let r = this.states.comments[key]
    if (r) {
      if (!col) {
        this.grid.$delete(this.states.comments, key)
      } else {
        this.grid.$delete(r, col)
      }
    }
  }

  getClass (row, column) {
    let {key, col} = this.getKey(row, column)
    let r = this.states.classes[key]
    if (!r) return ''
    return r[col]
  }

  setClass (row, column, name) {
    let {key, col} = this.getKey(row, column)
    let r = this.states.classes[key]
    if (!r) {
      r = this.grid.$set(this.states.classes, key, {})
    }
    this.grid.$set(r, col, name)
  }

  removeClass (row, column) {
    let {key, col} = this.getKey(row, column)
    let r = this.states.classes[key]
    if (r) {
      if (!col) {
        this.grid.$delete(this.states.classes, key)
      } else {
        this.grid.$delete(r, col)
      }
    }
  }

  // 更新行
  updateRow (row){
    List.update(this.states.data, row, '_rowKey')
    return row
  }

  getPosition (row, list, position) {
    if (!row || !list || list && list.length === 0) return -1
    return List.index(list, row, '_rowKey')
  }

  // 新加记录有一个 _new 属性
  // parent 用于处理添加子结点
  // position = 'before', 'after'
  addRow (row, item, position='after', isChild=false) {
    let pos, data
    if (!row) {
      row = this.getDefaultRow()
      for(let c of this.states.columns) {
        let v = ''
        if (c.type === 'column') {
          row[c.name] = ''
        }
      }
    } else {
      row = this.getDefaultRow(row)
    }
    row['_new'] = true
    // if (!row[this.states.idField]) {
    //   row[this.states.idField] = uuid()
    // }
    if (!item){
      data = this.states.data
      pos = this.getPosition(item, data, position)
    } else if(!isChild) {
      data = item._parent
      if (data) {
        data = data[this.states.childrenField]
      } else {
        data = this.states.data
      }
      pos = this.getPosition(item, data, position)
    } else {
      data = item[this.states.childrenField]
      if (!data) {
        this.grid.$set(item, this.states.childrenField, [])
        data = item[this.states.childrenField]
        this.grid.$set(item, '_loaded', true)
        this.grid.$set(item, '_expand', true)
        row._parent = item
      }
      // 子结点，after为最后，before为最前
      if (position === 'after') pos = -1
      else pos = 0
    }
    if (position === 'after')
      List.add(data, row, pos)
    else
      List.insert(data, pos, row)
    this.states.total += 1
    return row
  }

  addChildRow (row, parent, position) {
    return this.addRow(row, parent, position, true)
  }
  /* 生成新的可编辑行
   options 为滚动属性
  */
  addEditRow (row, parent, position, isChild=false) {
    let n_row = this.addRow(row, parent, position, isChild)
    this.grid.$set(n_row, '_editRow', Object.assign({}, n_row))
    this.grid.$set(n_row, '_editting', true)
    // if (options === undefined) return

    // this.grid.$nextTick(() => {
    //   let el = this.grid.$refs.table.$refs.rows[this.states.data.length-1]
    //   function findParent(e) {
    //     let p = e.parentNode
    //     while (p) {
    //       if (p.scrollHeight > p.clientHeight) break
    //       p = p.parentNode
    //     }
    //     return p
    //   }
    //   // var container = el.offsetParent.offsetParent
    //   var _options = {
    //     easing: 'ease-in',
    //     offset: 0,
    //     cancelable: false,
    //     x: false,
    //     y: true
    //   }
    //   if (options === true) options = {}
    //   else if (typeof options === 'string') options = {container: options}
    //   let opts = Object.assign({}, _options, options)
    //   if (!opts.container) {
    //     opts.container = findParent(el) || 'body'
    //   }
    //   VueScrollTo.scrollTo(el, 1, opts)
    // })

    return n_row
  }

  addEditChildRow (row, parent, position) {
    return this.addEditRow(row, parent, position, true)
  }

  mergeStates (o) {
    for (let name in o) {
      if (this.states.hasOwnProperty(name)) {
        this.grid.$set(this.states, name, o[name])
      }
    }
  }

  // 获得指定表头字段
  getColumn (name) {
    for (let col of this.states.columns) {
      if (col.name === name) return col
    }
  }

  /* 设置查询相关的参数，分别回填到对应的 page, pageSize, query 中作为初始值 */
  setParam (p) {
    if (!p) return
    if (p.hasOwnProperty('page')) {
      this.states.page = p.page
      delete p.page
    }
    if (p.hasOwnProperty('pageSize')) {
      this.states.pageSize = p.pageSize
      delete p.pageSize
    }

    if (this.states.query)
      this.states.query.value = Object.assign({}, p)
  }

  getDefaultRow (row={}) {
    return Object.assign({
      _hover: false,
      _selectable: true, // 可被选中
      _checkable: true, // 可显示checkbox
      _editting: false,
      _hidden: false,
      _level: 0,
      _rowKey: rowKey++,
      _parent: parent
    }, row)
  }

  makeRows (data, parent) {
    var rows = []
    data.forEach(row => {
      let new_row = this.getDefaultRow(row, parent)
      if (new_row[this.states.childrenField] && new_row[this.states.childrenField].length > 0) {
        new_row['_loaded'] = true
        new_row[this.states.childrenField] = this.makeRows(new_row[this.states.childrenField])
      }
      rows.push(new_row)
    })
    return rows
  }

}


export default Store
