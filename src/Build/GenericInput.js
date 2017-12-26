import {getField} from './fields/fieldMapping.js'

export default {
  name: 'GenericInput',
  functional: true,
  props: {
    name: {},
    type: {
      type: String, // editor类型
      default: 'string'
    },
    value: {},  // 值
    static: {
      type: Boolean,
      default: false
    }, //是否表态展示
    options: Object, // 编辑控件选项
    multiple: {
      type: Boolean,
      default: false
    },
    convert: {},
    placeholder: {},
    info: {},
    required: {
      type: Boolean,
      default: false
    },
    display: {
      type: String,
      default: ''
    }
  },
  render (h, ctx) {
    let self = ctx.props
    let InputClass = getField(self.type)
    let input = new InputClass(ctx.props)
    if (self.static) {
      let callback = (v) => {
        ctx.listeners['on-display-change'] && ctx.listeners['on-display-change'](v)
      }
      //判断是否有name_static值，如果有，则不再执行getStaticValue的方法
      if (!self.value[`${self.name}_static`]) {
        input.getStaticValue(self.value[self.name], callback)
      }
    }
    return input.render(h, ctx)
  }
}
