<template>
  <component :is="boxComponent || 'Box'" :title="title" class="u-layout">
    <table>
      <tbody>
        <tr v-for="row in rows">
          <td v-for="col in row" class="u-layout-cell" :colspan="col.colspan" :width="col.width">
            <FormCell :col="col" :value="value"></FormCell>
          </td>
        </tr>
      </tbody>
    </table>
  </component>
</template>

<script>
import List from '@/utils/list.js'
import FormCell from './FormCell'

export default {
  name: 'Layout',
  components: {
    FormCell
  },
  props: {
    name: String,
    title: {
      type: String,
      default: ''
    },
    tools: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Array,
      default: () => []
    },
    boxComponent: {
      type: String,
      default: 'Box'
    },
    value: Object,
    static: {
      type: Boolean,
      default: false
    } //是否表态展示

  },

  computed: {
    rows () {
      let r = [], name
      for (let row of this.layout) {
        let new_r = []
        r.push(new_r)
        let span = 24 / row.length

        //重新计算col
        for (let col of row) {
          if (typeof col === 'object') {
            name = col.name
            span = col.colspan || span
          } else {
            name = col
          }
          let width = 100 / 24 * span
          let f = List.get(this.fields, name, 'name')
          let field = Object.assign({colspan: span,
            width: `${width}%`,
            static: col.static || this.static,
          }, f)

          // 初始化校验规则，使用数组形式
          if (!field.rule) {
            field.rule = []
          }

          if (!Array.isArray(field.rule)) {
            field.rule = [field.rule]
          }

          // 添加必填校验
          if (field.required) {
            field.rule.splice(0, 0, {type: 'string', required: true})
          }
          new_r.push(field)
        }
      }
      return r
    }
  }
}
</script>

<style lang="less">

.u-layout {
  table {
    width: 100%;

    td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;

      &:hover {
        background-color: whitesmoke;
      }

      .u-layout-row {
        display: table-row;
        width: 100%;
        min-height: 34px;

        .u-layout-cell-label {
          min-width: 120px;
          display: table-cell;
          text-align: right;
          margin-right: 10px;
          vertical-align: top;
          font-weight: bold;
          margin-bottom: 0;
          padding-right: 10px;
          padding-top: 5px;
          font-size: 14px;
        }

        .u-layout-cell-field {
          display: table-cell;
          width: 2000px;
          vertical-align: bottom;
          /* border-bottom: 1px solid #ccc; */

          &:hover {
            background-color: whitesmoke;
          }

          .u-generic-input-text {
            font-size: 14px;
          }

          .u-layout-cell-help {
            display: block;
            color: #9ea7b4;
            font-size: 12px;
            margin-top: 5px;
            margin-left: 2px;
          }
        }

        &.u-layout-row-required {
          .u-layout-cell-label:before {
            content: "*";
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed3f14;
          }
        }

        &.u-layout-row-error {
          .u-layout-cell-error {
            display: block;
            color: #ed3f14;
            font-size: 12px;
            margin-top: 5px;
            margin-left: 2px;
          }

          .ivu-input {
            border: 1px solid #ed3f14;
          }
        }
      }
    }
  }
}
</style>
