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
    loadingText: '<i class="icon-loading ivu-icon ivu-icon-load-c"></i> Loading', // 正在装入时显示的文本
    autoLoad: true, // 是否自动装入数据
    url: '', // 访问后台的URL
    param: {
    }, // 访问后台的URL所带参数，可以是函数
    buttons: [],
    rightButtons: [],
    bottomButtons: [],

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

Store.prototype.selected = function (row) {
  return row._selected
}

Store.prototype.toggle = function (row) {
  if (row._selected) this.deselect(row)
  else this.select(row)
}

Store.prototype.select = function (row) {
  if (!this.states.multiSelect) this.deselectAll()
  this.grid.$set(row, '_selected', true)
  this.grid.$emit('on-selected', row)
}

Store.prototype.deselect = function (row) {
  this.grid.$set(row, '_selected', false)
  this.grid.$emit('on-deselected', row)
}

Store.prototype.deselectAll = function () {
  this.states.data.forEach(row => {
    this.grid.$set(row, '_selected', false)
  })
  this.grid.$emit('on-deselected-all')
}

Store.prototype.selectAll = function () {
  this.states.data.forEach(row => {
    this.grid.$set(row, '_selected', true)
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

Store.prototype.showLoading = function (loading=true, text='') {
  this.states.loading = loading
  if (text) {
    this.states.loadingText = text
  }
  if (loading) {
    this.states.loadingTop = this.grid.$refs.table.$el.clientHeight/2-this.states.rowHeight/2
    this.states.loadingLeft = this.grid.$refs.table.$el.clientWidth/2-100/2
  }
}

export default Store
