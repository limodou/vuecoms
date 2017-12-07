import {Input, DatePicker} from 'iview'
import uSelect from '../Select'
import {isDate} from '@/utils/utils.js'

const editor_map = {
  string: {name: 'Input', options: {}},
  select: {name: 'u-select', options: {}},
  date: {name: 'DatePicker', options: {transfer: true},
    convert: x => {
      if (x instanceof Date){
        return `${x.getFullYear()}/${x.getMonth()+1}/${x.getDate()}`
      }
      if (isDate(x)) {
        return x
      }
      return ''
    }
  }
}

export default {
  name: 'CellEditor',
  functional: true,
  components: {
    Input,
    uSelect
  },
  props: {
    col: Object,
    display: String,
    row: Object,
    nowrap: Boolean,
    editRow: Object,
    column: {
      type: Object,
      default: null
    },
    editorOptions: Object
  },
  render (h, ctx) {
    if (ctx.props.row._editting || ctx.props.col._editting) {
      let editor = editor_map[ctx.props.column.editor] || {name: 'Input', options: {}}
      let v = ctx.props.editRow[ctx.props.col.column.name]
      let props = Object.assign(editor.options, {value: v}, ctx.props.editorOptions)
      return h(editor.name, {
        props,
        on: {
          input: (x) => {
            if (editor.convert) {
              x = editor.convert(x)
            }
            ctx.parent.$set(ctx.props.editRow, ctx.props.col.column.name, x)
          }
        }
      })
    } else {
      return h('div', {
        'class': {
          'u-cell-text': true,
          nowrap: ctx.props.nowrap
        },
        domProps: {
          innerHTML: ctx.props.display
        }
      })
    }
  }
}
