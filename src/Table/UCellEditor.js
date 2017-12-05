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
    norwap: Boolean,
    column: {
      type: Object,
      default: null
    },
    editorOptions: Object
  },
  render: (h, ctx) => {
    if (ctx.props.row._editting || ctx.props.col._editting) {
      let editor = editor_map[ctx.props.column.editor] || 'Input'
      return h(editor, {
        props: {
          value: ctx.props.col.value,
          options: ctx.props.editorOptions
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
