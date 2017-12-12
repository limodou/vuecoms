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
    @on-selected="handleSelected"
    @on-deselected="handleDeselected"
    @on-selected-all="handleSelectedAll"
    @on-deselected-all="handleDeselectedAll"></Grid>
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
      ],

      onLoadData: function (url, param, callback) {
        self.param = Object.assign({}, param)
        var data = []
        var b = (param.page - 1) * param.pageSize
        for (var i = 0; i < param.pageSize; i++) {
          var row = {id: b + i + 1, title: 'P' + param.page + '-Title-' + (i + 1)}
          for (var j = 1; j < 10; j++) {
            row['name' + j] = 'P' + param.page + '-Name-' + (i + 1) + '-' + j
          }
          data.push(row)
        }
        setTimeout( function () {
          callback(data)
          }, 0)
      },

      onSelect: function (row) {
        var r = row.id !== 1
        if (!r) {
          self.$Message.info('本行不能选择')
        }
        return r
      },

      onCheckable: function (row) {
        var r = row.id !== 2 && row.id !==3
        return r
      }
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

    table.query = {
      fields: [
        {name: "str1", type: "str", label: "字符串1", placeholder: "请输入字符串1"}
      ],
      layout: [
        ['str1']
      ],
      value: {
        str1: "Hello World!!!"
      },
      buttons: {
        align: "center",//按钮左中右 start center end 默认 end
        submit: {
          label: "点此查询",
        },
        clear: {
          label: "点此清除"
        }
      }
    }

    return {
      table:table,
      selected:[],
      logs:[],
      loading_text:'loading',
      show_loading:false,
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

### 编辑表格

{% tabs %}

-- Result --

使用行编辑

{% include-code %}
<div id="ex-table-04">
  <Grid ref="table" :data="table"></Grid>
</div>
<script>
var ex_table_04 = new Vue({
  el: '#ex-table-04',
  data: function () {
    var self = this
    var table = {
      editMode: 'row', // 行编辑模式
      nowrap: true,
      actionColumn: 'Action',
      columns: [
        {name:'name1', title:'Name1', width:200, editor: 'string'},
        {name:'name2', title:'Name2', width: 200, align: 'left', editor: 'select', editorOptions: {
          choices: [['A', 'Test A'], ['B', 'Test B']]
          }},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', width:200, editor: 'date'},
        {name:'Action', title:'Name5'}
      ],
      buttons: [
        [{label: '查看结果', type:'primary', onClick: function(){
            console.table(self.$refs.table.store.states.data)
          }}],
        [{label: '显示注释', type:'primary', onClick: function(){
              self.$refs.table.store.setComment(1, 'name3', '这是评论')
            }},
        {label: '隐藏注释', type:'primary', onClick: function(){
              self.$refs.table.store.removeComment(1, 'name3')
            }}
          ],
        [{label: '显示Class', type:'primary', onClick: function(){
              self.$refs.table.store.setClass(3, 'name3', 'ivu-btn-error')
            }},
        {label: '删除Class', type:'primary', onClick: function(){
              self.$refs.table.store.removeClass(3, 'name3')
            }}
          ]
      ],

      data: [],

      onSaveRow: function (row, callback) {
        self.$Message.info("save")
        if (row.name1 === 'ok') {
          setTimeout(function() {
            callback('ok', row)
          }, 500)
        } else {
          setTimeout(function() {
            callback('error', {name1: '不正确'})
          }, 500)
        }

      },
      onDeleteRow: function (row, callback) {
        self.$Message.info("delete")
        callback('ok', row)
      }
    }

    table.data.push({id:1, name1:'Field-A1', name2:'A', name3:'Field-C1', name4:'Field-D1'})
    table.data.push({id:2, name1:'Field-A2', name2:'B', name3:'Field-C2', name4:'Field-D2'})
    table.data.push({id:3, name1:'Field-A3', name2:'A', name3:'Field-C3', name4:'Field-D3'})
    table.data.push({id:4, name1:'Field-A4', name2:'B', name3:'Field-C4', name4:'Field-D4'})
    table.data.push({id:5, name1:'Field-A5', name2:'A', name3:'Field-C5', name4:'Field-D5'})
    table.data.push({id:6, name1:'Field-A6', name2:'A', name3:'Field-C6', name4:'Field-D6'})

    return {table:table}
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex_table_04 = new Vue({
  el: '#ex-table-04',
  data: function () {
    var self = this
    var table = {
      editMode: 'row', // 行编辑模式
      nowrap: true,
      actionColumn: 'Action',
      columns: [
        {name:'name1', title:'Name1', width:200, editor: 'string'},
        {name:'name2', title:'Name2', width: 200, editor: 'select', editorOptions: {
          choices: [['A', 'Test A'], ['B', 'Test B']]
          }},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', width:200},
        {name:'Action', title:'Name5'}
      ],
      buttons: [
        [{label: '查看结果', type:'primary', onClick: function(){
            console.table(self.$refs.table.store.states.data)
          }}]
      ],

      data: [],

      onSaveRow: function (row, callback) {
        self.$Message.info("save")
        callback('ok', row)
      },
      onDeleteRow: function (row, callback) {
        self.$Message.info("delete")
        callback('ok', row)
      }
    }

    table.data.push({id:1, name1:'Field-A1', name2:'A', name3:'Field-C1', name4:'Field-D1'})
    table.data.push({id:2, name1:'Field-A2', name2:'B', name3:'Field-C2', name4:'Field-D2'})
    table.data.push({id:3, name1:'Field-A3', name2:'A', name3:'Field-C3', name4:'Field-D3'})
    table.data.push({id:4, name1:'Field-A4', name2:'B', name3:'Field-C4', name4:'Field-D4'})
    table.data.push({id:5, name1:'Field-A5', name2:'A', name3:'Field-C5', name4:'Field-D5'})
    table.data.push({id:6, name1:'Field-A6', name2:'A', name3:'Field-C6', name4:'Field-D6'})

    return {table:table}
  }
})
```

-- HTML --

```
<Grid ref="table" :data="table"></Grid>
```

{% endtabs %}

## Query

### 基本用法

{% tabs %}
-- Result --

展示一个查询界面

{% include-code %}
<div id="ex-query-01">
  <query-form :fields="fields" :layout="layout" :value="value" :buttons="buttons" :show-line="3"></query-form>
</div>
<script>
var ex_query_01 = new Vue({
  el: '#ex-query-01',
  methods: {
        changed: function (data) {
          console.log(data);
          return true;
        },
        submit: function(data){
          console.log("submit event => ",data);
          return true
        }
  },
  data: function () {
        return {
          fields: [
                    {name: "str1", type: "str", label: "字符串1", placeholder: "请输入字符串1"},
                    {name: "str2", type: "str", label: "字符串2", placeholder: "请输入字符串2"},
                    {
                      name: "select1",
                      type: "iselect",
                      label: "选择1",
                      choices: [{label: "西雅图", value: "city_001"}, {label: "旧金山", value: "city_002"}, {
                        label: "洛杉矶",
                        value: "city_003"
                      }],
                      multiple: false,
                      clearable: true,
                      disabled: false,
                      filterable: true,
                      size: "large", // small default large
                      placeholder: "这是一个下拉单选项"
                    },
                    {
                      name: "select2",
                      type: "iselect",
                      label: "选择2",
                      choices: [{label: "西雅图", value: "city_001"}, {label: "旧金山", value: "city_002"}, {
                        label: "洛杉矶",
                        value: "city_003"
                      }],
                      multiple: true,
                      disabled: false,
                      filterable: true,
                      placeholder: "这是一个下拉多选项"
                    },
                    {
                      name: "datepicker",
                      type: "date",
                      label: "日期",
                      placeholder: "日期单选",
                      format: "yyyy#MM#dd",
                      confirm: true,
                      size: "small",
                      disabled: false,
                      placement: "bottom",//top top-start top-end bottom bottom-start bottom-end left left-start left-end right right-start right-end (default bottom-start)
                      readonly: false,
                      editable: false,
                      clearable: false,
                      transfer: false,
                      options: {
                        disabledDate: function (date) {
                          return date && date.valueOf() < Date.now() - 86400000;
                        },
                        shortcuts: [
                          {
                            text: 'Today',
                            value: function() {
                              return new Date();
                            },
                            onClick: function(picker){
                              this.$Message.info('Click today');
                            }
                          },
                          {
                            text: 'Yesterday',
                            value: function(){
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24);
                              return date;
                            },
                            onClick: function(picker){
                              this.$Message.info('Click yesterday');
                            }
                          },
                          {
                            text: 'One week',
                            value: function(){
                              var date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                              return date;
                            },
                            onClick: function(picker){
                              this.$Message.info('Click a week ago');
                            }
                          }
                        ]
                      }
                    },
                    {
                      name: "radio",
                      type: "radio",
                      label: "单选框",
                      rType: "button", // button or null
                      disabled: false,
                      size: "small",
                      vertical: true,
                      choices: [{label: "1", name: "备选项1"}, {label: "2", name: "备选项2", disabled: true}, {
                        label: "3",
                        name: "备选项3"
                      }]
                    },
                    {
                      name: "checkbox",
                      type: "checkbox",
                      label: "多选框",
                      size: "large", //small default large
                      disabled: false,
                      choices: [{label: "1", name: "备选项1"}, {label: "2", name: "备选项2"}, {
                        label: "3",
                        name: "备选项3",
                        disabled: true
                      }]
                    },
                  ],
                  layout: [
                    ['str1', 'str2'],
                    ['select1', 'select2'],
                    ["datepicker"],
                    ['radio', 'checkbox']
                  ],
                  value: {
                    select1: 'city_003',
                    select2: ["city_001"],
                    str1: "Hello World!!!",
                    checkbox: ["1","2"],
                    radio: "1",
                    datepicker: "2016-01-01"
                  },
                  buttons: {
                    align: "center",//按钮左中右 start center end 默认 end
                    submit: {
                      label: "点此查询",
                    },
                    clear: {
                      label: "点此清除",
                      show:false
                    }
                  }
        }
      },
})
</script>
{% endinclude-code %}

-- Javascript --

```
var ex01 = new Vue({
  el: '#ex-query-01'
})
```

-- HTML --

```
<div id="ex-query-01"></div>
```
{% endtabs %}


## Tree

### Tree演示

{% tabs %}

-- Result --

Tree控件演示

{% include-code %}
<div id="ex-tree-01" style="width: 200px; overflow: auto; border: 1px solid gray;">
  <Tree :data="data"></Tree>
</div>
<script>
var ex_tree_01 = new Vue({
  el: '#ex-tree-01',
  data: function () {
    var data = [
      {
        title: 'parent 1',
        expand: true,
        children: [
          {
            title: 'parent 1-1 - long- long- long- long- long- long',
            expand: true,
            children: [
              {
                title: 'leaf 1-1-1- long- long- long- long- long- long'
              },
              {
                title: 'leaf 1-1-2'
              }
            ]
          },
          {
            title: 'parent 1-2',
            expand: true,
            children: [
              {
                title: 'leaf 1-2-1'
              },
              {
                title: 'leaf 1-2-1'
              }
            ]
          }
        ]
      }
    ]
    return {data:data}
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
```

-- HTML --

```
<Tree :data="data"></Tree>
```

{% endtabs %}

## Build

### 基本构建

字段的标准定义如下：

```
{
  name: //名字
  label: //标签
  type: string|select 等，缺省为string
  static: true|false // 是否静态，缺省为false
  multiple: true|false // 是否多值，缺省为false
  options: // 根据不同的输入类型需要的额外属性
  convert: (value) => { return result}
}
```

{% tabs %}

-- Result --

{% include-code %}
<div id="ex-build-01">
  <build ref="build" :data="data" :value="value"></build>
  <div>
    {{value}}
  </div>
</div>
<script>
var ex_build_01 = new Vue({
  el: '#ex-build-01',
  data: function () {
    var self = this
    var data = [
      {
        name: 'basic',
        title: '基本信息',
        fields: [
          {name: 'str1', label: '很长的很长的很长的字符串1'},
          {name: 'str2', label: '静态字符串2', static: true, convert: function(v){
            return '<a href="#">' + v + '</a>'
            }
          },
          {name: 'select1', label: '选择', type: 'select', options: {choices: [
            {label:'选项一', value: 'A'},
            {label:'选项二', value: 'B'},
            ]}
          },
          {name: 'select2', label: '选择', type: 'select', static: true, options: {choices: [
            {label:'选项一', value: 'A'},
            {label:'选项二', value: 'B'},
            ]}
          },
          {name: 'select3', label: '选择', type: 'select', multiple: true, options: {choices: [
            {label:'选项一', value: 'A'},
            {label:'选项二', value: 'B'},
            ]}
          },
          {name: 'select4', label: '选择', type: 'select', multiple: true, static: true, options: {choices: [
            {label:'选项一', value: 'A'},
            {label:'选项二', value: 'B'},
            ]}
          },
          {name: 'text1', label: '文本1', type: 'text'},
          {name: 'text2', label: '文本2', type: 'text', static: true},
          {name: 'date1', label: '日期1', type: 'date'},
          {name: 'date2', label: '日期2', type: 'date', static: true},

        ],
        layout: [
          ['str1', 'str2'],
          ['select1', 'select2'],
          ['select3', 'select4'],
          ['text1'],
          ['text2'],
          ['date1', 'date2']
        ],
        layoutComponent: 'Snippet',
        boxComponent: 'Box'

      }

    ]

    return {data:data, value: {
              str1: '123',
              str2: 'aaa',
              select1: 'B',
              select2: 'A',
              select3: ['A', 'B'],
              select4: ['A', 'B'],
              text1: 'Line 1\nLine 2',
              text2: 'Line 3\nLine 4',
              date2: '2017-12-12'
            }
          }
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
```

-- HTML --

```
<Build ref="build" :data="data"></Build>
```

{% endtabs %}
