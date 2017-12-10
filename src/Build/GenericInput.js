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
  name: 'GenericInput',
  functional: true,
  props: {
    type: {
      type: String, // editor类型
      default: 'string'
    },
    value: {},  // 值
    display: String, // 显示值
    static: false, // 是否静态
    options: Object // 编辑控件选项
  },
  render (h, ctx) {
    let self = ctx.props
    let editor = editor_map[self.type] || {name: 'Input', options: {}}
    if (!self.static) {
      let props = Object.assign(editor.options, {value: self.value}, self.options)
      let c = h(editor.name, {
        props,
        on: {
          input: (x) => {
            if (editor.convert) {
              x = editor.convert(x)
            }
            c.$emit('input', x)
          }
        }
      })
      return c
    } else {
      return h('span', {
        'class': {
          'u-generic-input-text': true
        },
        domProps: {
          innerHTML: self.display || self.value
        }
      })
    }
  }
}
