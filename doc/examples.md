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
      columns: [ {
          name: 'id',
          title: 'ID',
          width: 40,
          align: 'center'
        },
        {
          name: 'title',
          title: '标题'
        },
        {
          name: 'author',
          title: '作者',
          width: 100,
          align: 'center'
        }
      ],
      data: [
        {id: 1, title: '神雕侠侣', author: '金庸'},
        {id: 2, title: '小李飞刀', author: '古龙'},
      ],
    }

    return {table:table}
  }
})
</script>
{% endinclude-code %}

-- Javascript --

```
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
  </div>
  <Grid ref='grid' :data="table"
    :on-load-data="onLoadData"
    @on-selected="handleSelected"
    @on-deselected="handleDeselected"
    @on-selected-all="handleSelectedAll"
    @on-deselected-all="handleDeselectedAll"></Grid>
  <div>{{selected}}</div>
  <div class="logs">
    <span v-for="log in logs">{{log}}</span>
  </div>
</div>
<script>
var ex_table_02 = new Vue({
  el: '#ex-table-02',
  data: function () {
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
      ]
    }
    table.columns.push({
      name: 'id',
      title: 'ID',
      width: 40,
      sortable: false,
      //fixed: 'left'
    })

    table.columns.push({
      name: 'title',
      title: 'Title',
      sortable: false,
      //fixed: 'left'
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

    for (var i = 0; i < 10; i++) {
      var row = {id: i + 1, title: 'Title-' + (i + 1)}
      for (var j = 1; j < 10; j++) {
        row['name' + j] = 'Name-' + (i + 1) + '-' + j
      }
      table.data.push(row)
    }

    onLoadData = function (url, param, callback) {
      let data = []
      for (var i = 0; i < 10; i++) {
        var row = {id: i + 1, title: 'P' + param.page + '-Title-' + (i + 1)}
        for (var j = 1; j < 10; j++) {
          row['name' + j] = 'P' + param.page + '-Name-' + (i + 1) + '-' + j
        }
        data.push(row)
      }
      setTimeout( () => {
        callback(data)        
        }, 2000)
    }

    return {table:table, selected:[], logs:[], loading_text:'loading', show_loading:false, onLoadData: onLoadData}
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
<Grid :data="table"></Grid>
```

{% endtabs %}
