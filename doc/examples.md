# 示例

## Box

### 基本用法

{% tabs %}

-- Result --

展示一块区域

{% include-code %}
<div id="ex-box-01">
  <Box title="这是标题">
    <p>这是内容</p>
    <p>这是内容</p>
    <p>这是内容</p>
    <p>这是内容</p>
  </Box>
</div>
<script>
var ex_box_01 = new Vue({
  el: '#ex-box-01'
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex01 = new Vue({
  el: '#ex-box-01'
})
```

-- HTML --

```
<Box title="这是标题">
  <p>这是内容</p>
  <p>这是内容</p>
  <p>这是内容</p>
  <p>这是内容</p>
</Box>
```

{% endtabs %}

## Table

### 基本用法

{% tabs %}

-- Result --

展示一个表格

{% include-code %}
<div id="ex-table-01">
  <Grid :data="table"></Grid>
</div>
<script>
var ex_table_01 = new Vue({
  el: '#ex-table-01',
  data: function () {
    var table = {
      nowrap: true,
      columns: [
        {name:'name1', title:'Name1', width:200, fixed: 'left'},
        {name:'name2', title:'Name2', width: 200, fixed: 'left'},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', align:'center', width:200},
        {name:'name5', title:'Name5', width:200},
        {name:'name6', title:'Name6', width:200}
      ],
      data: [],
      combineCols:['name1', 'name2', 'name3', 'name4']
    }

    table.data.push({id:1, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:2, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:3, name1:'A1', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:4, name1:'A2', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:5, name1:'A2', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:6, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})

    return {table:table}
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex_table_01 = new Vue({
  el: '#ex-table-01',
  data: function () {
    var table = {
      nowrap: true,
      columns: [
        {name:'name1', title:'Name1', width:200, fixed: 'left'},
        {name:'name2', title:'Name2', width: 200, fixed: 'left'},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', align:'center', width:200},
        {name:'name5', title:'Name5', width:200},
        {name:'name6', title:'Name6', width:200}
      ],
      data: [],
      combineCols:['name1', 'name2', 'name3', 'name4']
    }

    table.data.push({id:1, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:2, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:3, name1:'A1', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:4, name1:'A2', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:5, name1:'A2', name2:'B2', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:6, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})

    return {table:table}
  }
})
```

-- HTML --

```
<Grid :data="table"></Grid>
```

{% endtabs %}

### 复杂用法

{% tabs %}

-- Result --

{% include-code %}
<div id="ex-table-02">
  <div>
    <input ref="loading" v-model="loading_text" style="display:inline-block"></input>
    <label style="display:inline-block">切换loading<input v-model="show_loading" type="checkbox"></input></label>
    <button @click="handleTitleHide">切换Title字段显示</button>
  </div>
  <Grid ref='grid' :data="table"
    :on-load-data="onLoadData"
    @on-selected="handleSelected"
    @on-deselected="handleDeselected"
    @on-selected-all="handleSelectedAll"
    @on-deselected-all="handleDeselectedAll"
    :on-select="onSelect"
    :on-checkable="onCheckable"></Grid>
  <div>Selected: {{selected}}</div>
  <div>Param: {{param}}</div>
</div>
<script>
var ex_table_02 = new Vue({
  el: '#ex-table-02',
  data: function () {
    var self = this
    var table = {
      columns: [],
      multiSelect: true,
      resizable: true,
      pagination: true,
      pageSizeOpts: [10, 30, 50],
      total: 80,
      height: 300,
      draggable: true,

      checkCol: true,
      checkColWidth: 120,
      checkColTitle: 'Check All',
      indexCol: true,

      data: [
      ],

      buttons: [
        [{label: '新增', type:'primary', onClick: function(){
            self.$Message.info('Click 新增')
          }}, {label: '编辑', disabled: true}, {label: '删除'}],
        [{label: '上移', icon:'ios-arrow-thin-up'}, {label: '下移', icon: 'ios-arrow-thin-down'}]
      ],
      rightButtons: [
        [{label: '下载'}]
      ],
      bottomButtons: [
        [{'label': '导出'}]
      ]
    }
    table.columns.push({
      name: 'id',
      title: '合并/ID',
      width: 40,
      sortable: true,
      fixed: 'left'
    })

    table.columns.push({
      name: 'title',
      title: '合并/Title',
      sortable: true,
      fixed: 'left',
      format: function(value, column, row) {
        return '<a href="#">' + value + '</a>'
      }
    })

    for (var j = 1; j < 10; j++) {
      table.columns.push({
        name: 'name' + j,
        title: 'Column' + j,
        width: 100,
        sortable: false,
        align: 'center'
      })
    }

    //隐藏字段
    table.columns.push({
      name: 'title',
      title: 'Title',
      sortable: false,
      hidden: true
    })

    for (var i = 0; i < 10; i++) {
      var row = {id: i + 1, title: 'Title-' + (i + 1)}
      for (var j = 1; j < 10; j++) {
        row['name' + j] = 'Name-' + (i + 1) + '-' + j
      }
      table.data.push(row)
    }

    onLoadData = function (url, param, callback) {
      self.param = param
      var data = []
      var b = (param.page - 1) * param.pageSize
      for (var i = 0; i < 10; i++) {
        var row = {id: b + i + 1, title: 'P' + param.page + '-Title-' + (i + 1)}
        for (var j = 1; j < 10; j++) {
          row['name' + j] = 'P' + param.page + '-Name-' + (i + 1) + '-' + j
        }
        data.push(row)
      }
      setTimeout( function () {
        callback(data)        
        }, 500)
    }

    onSelect = function (row) {
      var r = row.id !== 1
      if (!r) {
        self.$Message.info('本行不能选择')
      }
      return r
    }

    onCheckable = function (row) {
      var r = row.id !== 2 && row.id !==3
      return r
    }

    return {
      table:table,
      selected:[],
      logs:[],
      loading_text:'loading',
      show_loading:false,
      onLoadData: onLoadData,
      onSelect: onSelect,
      onCheckable: onCheckable,
      param:{}
    }
  },

  watch: {
    show_loading: function() {
      this.$refs.grid.showLoading(this.show_loading, this.loading_text)
    }
  },

  methods: {
    handleSelected: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['selected', row])
    },
    handleDeselected: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['deselected', row])
    },
    handleSelectedAll: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['selected-all', row])
    },
    handleDeselectedAll: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['deselected-all', row])
    },
    handleTitleHide: function() {
      var title_column = this.table.columns[1]
      this.$set(title_column, 'hidden', !title_column.hidden)
    }
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex_table_02 = new Vue({
  el: '#ex-table-02',
  data: function () {
    var self = this
    var table = {
      columns: [],
      multiSelect: true,
      resizable: true,
      pagination: true,
      pageSizeOpts: [10, 30, 50],
      total: 80,
      height: 300,

      checkCol: true,
      checkColWidth: 120,
      checkColTitle: 'Check All',
      indexCol: true,

      data: [
      ],

      buttons: [
        [{label: '新增', type:'primary', onClick: function(){
            self.$Message.info('Click 新增')
          }}, {label: '编辑', disabled: true}, {label: '删除'}],
        [{label: '上移', icon:'ios-arrow-thin-up'}, {label: '下移', icon: 'ios-arrow-thin-down'}]
      ],
      rightButtons: [
        [{label: '下载'}]
      ],
      bottomButtons: [
        [{'label': '导出'}]
      ]
    }
    table.columns.push({
      name: 'id',
      title: '合并/ID',
      width: 40,
      sortable: true,
      fixed: 'left'
    })

    table.columns.push({
      name: 'title',
      title: '合并/Title',
      sortable: true,
      fixed: 'left',
      format: function(value, column, row) {
        return '<a href="#">' + value + '</a>'
      }
    })

    for (var j = 1; j < 10; j++) {
      table.columns.push({
        name: 'name' + j,
        title: 'Column' + j,
        width: 100,
        sortable: false,
        align: 'center'
      })
    }

    //隐藏字段
    table.columns.push({
      name: 'title',
      title: 'Title',
      sortable: false,
      hidden: true
    })

    for (var i = 0; i < 10; i++) {
      var row = {id: i + 1, title: 'Title-' + (i + 1)}
      for (var j = 1; j < 10; j++) {
        row['name' + j] = 'Name-' + (i + 1) + '-' + j
      }
      table.data.push(row)
    }

    onLoadData = function (url, param, callback) {
      self.param = param
      var data = []
      var b = (param.page - 1) * param.pageSize
      for (var i = 0; i < 10; i++) {
        var row = {id: b + i + 1, title: 'P' + param.page + '-Title-' + (i + 1)}
        for (var j = 1; j < 10; j++) {
          row['name' + j] = 'P' + param.page + '-Name-' + (i + 1) + '-' + j
        }
        data.push(row)
      }
      setTimeout( function () {
        callback(data)        
        }, 500)
    }

    return {table:table, selected:[], logs:[], loading_text:'loading', show_loading:false, onLoadData: onLoadData, param:{}}
  },

  watch: {
    show_loading: function() {
      this.$refs.grid.showLoading(this.show_loading, this.loading_text)
    }
  },

  methods: {
    handleSelected: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['selected', row])
    },
    handleDeselected: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['deselected', row])
    },
    handleSelectedAll: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['selected-all', row])
    },
    handleDeselectedAll: function(row) {
      this.selected = this.$refs.grid.getSelection()
      this.logs.push(['deselected-all', row])
    },
    handleTitleHide: function() {
      var title_column = this.table.columns[1]
      this.$set(title_column, 'hidden', !title_column.hidden)
    }
  }
})
```

-- HTML --

```
<div id="ex-table-02">
  <div>
    <input ref="loading" v-model="loading_text" style="display:inline-block"></input>
    <label style="display:inline-block">切换loading<input v-model="show_loading" type="checkbox"></input></label>
    <button @click="handleTitleHide">切换Title字段显示</button>
  </div>
  <Grid ref='grid' :data="table"
    :on-load-data="onLoadData"
    @on-selected="handleSelected"
    @on-deselected="handleDeselected"
    @on-selected-all="handleSelectedAll"
    @on-deselected-all="handleDeselectedAll"></Grid>
  <div>Selected: {{selected}}</div>
  <div>Param: {{param}}</div>
</div>
```

{% endtabs %}

### 表格拖动

{% tabs %}

-- Result --

展示一个表格

{% include-code %}
<div id="ex-table-03">
  <Grid ref="table" :data="table" @on-drag="handleDrag"></Grid>
</div>
<script>
var editButton = function (vm, h, row) {
  return h('Button', {
    props: {
      type: 'primary',
      size: 'small'
    },
    style: {
        margin: '0 5px'
    },
    on: {
        'click': function () {
          row.editting = !row.editting
          vm.$Message.info("Button Clicked")
        }
    }
  }, row.editting ? '保存' : '编辑')
}
var deleteButton = function (vm, h, row) {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗?',
      transfer: true
    },
    on: {
      'on-ok': function () {
        row.isDeleting = true
      }
    }
  }, [
    h('Button', {
      style: {
        margin: '0 5px'
      },
      props: {
        type: 'error',
        placement: 'top',
        size: 'small',
        loading: row.isDeleting
      }
    }, '删除')
  ])
}

var ex_table_03 = new Vue({
  el: '#ex-table-03',
  data: function () {
    var self = this
    var table = {
      nowrap: true,
      draggable: true,
      clickSelect: true,
      columns: [
        {name:'name1', title:'Name1', width:200,
          render: function(h, param){
            return h('RadioGroup', {
                props: {
                  value: param.value
                },
                on: {
                  'input': function (value) {
                    param.row[param.column.name] = value
                  }
                }
              }, [
                h('Radio', {
                  props: {
                    label: 'yes'
                  }
                }, '同意'),
                h('Radio', {
                  props: {
                    label: 'no'
                  }
                }, '不同意')
              ])
          }
        },
        {name:'name2', title:'Name2', width: 200,
          render: function(h, param){
            return h('Input', {
                props: {
                  value: param.value
                },
                on: {
                'input': function (value) {
                    param.row[param.column.name] = value
                  }
                }
              })
          }
        },
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', width:200},
        {name:'Action', title:'Name5', render: function(h, param) {
          return h('div', [
            editButton(ex_table_03, h, param.row),
            deleteButton(ex_table_03, h, param.row)
          ])
          }}
      ],
      buttons: [
        [{label: '查看结果', type:'primary', onClick: function(){
            console.table(self.$refs.table.store.states.data)
          }}]
      ],

      data: []
    }

    table.data.push({id:1, name1:'A1', name2:'B1', name3:'C1', name4:'D1'})
    table.data.push({id:2, name1:'A2', name2:'B2', name3:'C2', name4:'D2'})
    table.data.push({id:3, name1:'A3', name2:'B3', name3:'C3', name4:'D3'})
    table.data.push({id:4, name1:'A4', name2:'B4', name3:'C4', name4:'D4'})
    table.data.push({id:5, name1:'A5', name2:'B5', name3:'C5', name4:'D5'})
    table.data.push({id:6, name1:'A6', name2:'B6', name3:'C6', name4:'D6'})

    return {table:table}
  },
  methods: {
    handleDrag: function (v) {
      console.log(v)
    }
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex_table_01 = new Vue({
  el: '#ex-table-01',
  data: function () {
    var table = {
      nowrap: true,
      columns: [
        {name:'name1', title:'Name1', width:200, fixed: 'left'},
        {name:'name2', title:'Name2', width: 200, fixed: 'left'},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', align:'center', width:200},
        {name:'name5', title:'Name5', width:200},
        {name:'name6', title:'Name6', width:200}
      ],
      data: [],
      combineCols:['name1', 'name2', 'name3', 'name4']
    }

    table.data.push({id:1, name1:'A1', name2:'B1', name3:'C1', name4:'D1', name5:'E1', name6:'F1'})
    table.data.push({id:2, name1:'A2', name2:'B2', name3:'C2', name4:'D2', name5:'E2', name6:'F2'})
    table.data.push({id:3, name1:'A3', name2:'B3', name3:'C3', name4:'D3', name5:'E3', name6:'F3'})
    table.data.push({id:4, name1:'A4', name2:'B4', name3:'C4', name4:'D4', name5:'E4', name6:'F4'})
    table.data.push({id:5, name1:'A5', name2:'B5', name3:'C5', name4:'D5', name5:'E5', name6:'F5'})
    table.data.push({id:6, name1:'A6', name2:'B6', name3:'C6', name4:'D6', name5:'E6', name6:'F6'})

    return {table:table}
  }
})
```

-- HTML --

```
<Grid :data="table"></Grid>
```

{% endtabs %}
