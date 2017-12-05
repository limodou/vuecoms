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
    var table = {
      nowrap: true,
      draggable: true,
      clickSelect: true,
      columns: [
        {name:'name1', title:'Name1', width:200},
        {name:'name2', title:'Name2', width: 200},
        {name:'name3', title:'Name3', width:200},
        {name:'name4', title:'Name4', width:200},
        {name:'Action', title:'Name5', render: function(h, param) {
          return h('div', [
            editButton(ex_table_03, h, param.row),
            deleteButton(ex_table_03, h, param.row)
          ])
          }}
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
      console.table(this.$refs.table.store.states.data)
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


## Query

### 基本用法

{% tabs %}
-- Result --

展示一个查询界面

{% include-code %}
<div id="ex-query-01">
  <query-form :fields="fields" :layout="layout" :value="value" :buttons="buttons"></query-form>
</div>
<script>
var ex_query_01 = new Vue({
  el: '#ex-query-01',
  data: function () {
        return {
          fields: [
            {name: "str1", type: "str", label: "字符串1：", placeholder: "请输入字符串1"},
            {name: "str2", type: "str", label: "字符串2：", placeholder: "请输入字符串2"},
            {
              name: "select1",
              type: "iselect",
              label: "选择：",
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
              label: "选择：",
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
              label: "日期：",
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
                    value () {
                      return new Date();
                    },
                    onClick: (picker) => {
                      this.$Message.info('Click today');
                    }
                  },
                  {
                    text: 'Yesterday',
                    value () {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24);
                      return date;
                    },
                    onClick: (picker) => {
                      this.$Message.info('Click yesterday');
                    }
                  },
                  {
                    text: 'One week',
                    value () {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                      return date;
                    },
                    onClick: (picker) => {
                      this.$Message.info('Click a week ago');
                    }
                  }
                ]
              }
            },
            {
              name: "radio",
              type: "radio",
              label: "单选框：",
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
              label: "多选框：",
              size: "large", //small default large
              disabled: false,
              choices: [{label: "1", name: "备选项1"}, {label: "2", name: "备选项2"}, {
                label: "3",
                name: "备选项3",
                disabled: true
              }]
            }
          ],
          layout: [
            ['str1', 'str2', 'select1', 'select2', "datepicker", 'radio', 'checkbox']
          ],
          value: {
            select1: 'city_003',
            select2: ["city_001"],
            str1: "Hello World!!!",
            cascader1: ['zujian', 'data', 'tag'],
            transfer: [1, 2],
            datepicker: "2016-01-01"
          },
          buttons: {
            submit: {
              label: "点此查询",
              callback: function (val) {
                console.log("submit event => ", val);
              }
            },
            clear: {
              title: "清除"
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
