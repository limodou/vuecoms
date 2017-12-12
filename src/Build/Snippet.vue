<template>
  <component :is="boxComponent" :title="title" class="u-snippet">
    <table>
      <tbody>
        <tr v-for="row in rows">
          <td v-for="col in row" class="u-snippet-cell" :colspan="col.colspan" :width="col.width">
            <div class="u-snippet-cell-row">
              <label class="u-snippet-cell-label">{{col.label}}</label>
              <div class="u-snippet-cell-field">
                <GenericInput v-bind="col" :value="value"></GenericInput>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </component>
</template>

<script>
import GenericInput from './GenericInput'
import List from '@/utils/list.js'

export default {
  name: 'Snippet',
  components: {
    GenericInput
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
            static: col.static || this.static
          }, f)
          new_r.push(field)
        }
      }
      return r
    }
  }
}
</script>

<style lang="less">

.u-snippet {
  table {
    width: 100%;

    td {
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;

      &:hover {
        background-color: whitesmoke;
      }

      .u-snippet-cell-row {
        display: table-row;
        width: 100%;
        min-height: 34px;

        .u-snippet-cell-label {
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

        .u-snippet-cell-field {
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
        }
      }
    }
  }
}
</style>
