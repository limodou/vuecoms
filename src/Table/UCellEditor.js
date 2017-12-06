import {Input} from 'iview'
import uSelect from '../Select'

const editor_map = {
  string: 'Input',
  select: 'u-select'
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
      let editor = editor_map[ctx.props.column.editor] || 'Input'
      let v = ctx.props.editRow[ctx.props.col.column.name]
      return h(editor, {
        props: {
          value: v,
          options: ctx.props.editorOptions
        },
        on: {
          input: (x) => {
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
