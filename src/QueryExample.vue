<template>
  <QueryForm :fields="fields" :layout="layout" :value="value" :buttons="buttons"></QueryForm>
</template>
<script type="text/ecmascript-6">

  import QueryForm from "./query"

  export default {
    name: 'query',
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
    components:{
      QueryForm
    }
  }
</script>
