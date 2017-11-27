function Store (grid, options) {
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
    clickSelect: true,  // 点击选中
    resizable: true, // 是否表头列可以调整大小
    indexCol: false, // 是否显示序号列
    indexColTitle: '#',
    indexColWidth: 40,

    // 内部变量
    columnResizing: false,
    columnPosition: 0,
    checkAll: false,
    fixedColumns: [],
    leftWidth: 0, // 左则固定列宽度
    hscroll: false,
    xscroll: false,
    scrollLeft: 0, // 记录横向滚动条偏移量，用于显示左侧固定列的特殊样式
    guiderHeight: 0, // 拖动指示器的高度

    // 分页相关参数
    prev: 'Prev',
    next: 'Next',
    first: '',
    last: '',
    start: 1,
    total: 0,       // 总条数
    pageSizeOpts: [10, 20, 30, 40, 50], // 每页条数选项
    pagination: false, // 是否显示分页信息，缺省为 false
    page: 1,
    pageSize: 10,

    // 事件
    onSelected: function () {},
    onDeselected: function () {},
    onSelectAll: function () {},
    onDeselectAll: function () {}
  }

  for (let name in options) {
    if (options.hasOwnProperty(name) && this.states.hasOwnProperty(name)) {
      this.states[name] = options[name]
    }
  }

  if (!grid) {
    throw new Error('Grid object is Required.')
  }
}

Store.prototype.selected = function (row) {
  return row._selected
}

Store.prototype.toggle = function (row) {
  if (row._selected) this.deselect(row)
  else this.select(row)
}

Store.prototype.select = function (row) {
  if (!this.states.multiSelect) this.deselectAll()
  row._selected = true
  this.grid.$emit('on-selected', row)
}

Store.prototype.deselect = function (row) {
  row._selected = false
  this.grid.$emit('on-deselected', row)
}

Store.prototype.deselectAll = function () {
  this.states.data.forEach(row => {
    row._selected = false
  })
  this.grid.$emit('on-deselected-all')
}

Store.prototype.selectAll = function () {
  this.states.data.forEach(row => {
    row._selected = true
  })
  this.grid.$emit('on-selected-all')
}

Store.prototype.getSelection = function () {
  let selected = []
  this.states.data.forEach(row => {
    if (row._selected) {
      selected.push(row[this.states.idField])
    }
  })
  return selected
}

export default Store
