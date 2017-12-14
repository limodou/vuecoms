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
    }
  },
  render (h, ctx) {
    let self = ctx.props
    let InputClass = getField(self.type)
    let input = new InputClass(ctx.props)
    if (self.static) {
      let callback = (v) => {
        self.display = v
      }
      input.getCachedStaticValue(self.value[self.name], callback)
    }
    return input.render(h, ctx)
  }
}
