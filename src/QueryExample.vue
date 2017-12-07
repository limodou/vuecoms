<template>
  <QueryForm :fields="fields" :layout="layout" :value="value" :buttons="buttons" :submit="submit" :changed="changed"></QueryForm>
</template>
<script type="text/ecmascript-6">

  import QueryForm from "./query"

  export default {
    name: 'query',
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
          // {
          // 	name: "cascader1",
          // 	type: "cascader",
          // 	label: "级联选择：",
          // 	showAllLevels: false,
          // 	filterable: true,
          // 	changeOnSelect: true,
          // 	choices: CASCADER_CHOICES
          // },
          // {
          // 	name: "timeselect",
          // 	type: "timeselect",
          // 	options: {start: "00:00", step: "01:00", end: "24:00"},
          // 	label: "时间select："
          // },
          // {
          // 	name: "timepicker",
          // 	type: "timepicker",
          // 	options: {selectableRange: '00:00:00 - 01:00:00'},
          // 	label: "时间picker："
          // },
          // {name: "timepickerrange", type: "timepickerrange", label: "时间pickerrange："},

          // {name: "datetimepicker", type: "datetimepicker", label: "日期时间选择："},
          // {name: "datepickerrange", type: "datepickerrange", label: "日期范围："},
          // {name: "datetimepickerrange", type: "datetimepickerrange", label: "日期时间范围："},
          // {
          // 	name: "transfer",
          // 	type: "transfer",
          // 	label: "穿梭框：",
          // 	choices: [{key: 1, label: "北京"}, {key: 2, label: "上海"}, {key: 3, label: "广州"}, {
          // 		key: 4,
          // 		label: "深圳",
          // 		disabled: true
          // 	}]
          // },
          // {
          // 	name: "checkbox",
          // 	type: "checkbox",
          // 	label: "多选框：",
          // 	min: 0,
          // 	max: 1,
          // 	choices: [{label: "备选项1", name: "checkbox1"}, {label: "备选项2", name: "checkbox2"}, {
          // 		label: "备选项3",
          // 		name: "checkbox3",
          // 		disabled: true
          // 	}]
          // },
          // {name: "poptree", type: "poptree", label: "选择树："}
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
          cascader1: ['zujian', 'data', 'tag'],
          transfer: [1, 2],
          datepicker: "2016-01-01"
        },
        buttons: {
          justify: "center",//按钮左中右 start center end 默认 end
          submit: {
            label: "点此查询",
            beforeSubmit: function (val) {
              console.log("beforeSubmit event => ", val);
              return {str1: "你好Vue"};
            }
          },
          clear: {
            label: "点此清除"
          }
        }
      }
    },
    components: {
      QueryForm
    },
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
  }
</script>
