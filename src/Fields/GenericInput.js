import getField from './fieldMapping'
import StaticField from './StaticField'

export default {
  name: 'GenericInput',
  functional: true,
  props: {
    name: {},
    type: {
      type: String, // editor类型
      default: 'str'
    },
    value: {},  // 值
    static: {
      type: Boolean,
      default: false
    }, //是否静态展示
    enableOnChange: { // 是否允许确发onChange事件。主要用在Build中，因为有触发，所以需要禁掉input时的确发
      type: Boolean,
      default: true
    },
    onChange: {},
    options: {}, // 编辑控件选项
    multiple: {
      type: Boolean,
      default: false
    },
    format: {}, //对静态内容进行转化处理
    placeholder: {},
    info: {},
    required: {
      type: Boolean,
      default: false
    },
    staticSuffix: {
      type: String,
      default: '_static'
    },
    root: String, // 用于change事件发送的父控件的名字,
    staticComponent: {
      default () {
        return StaticField
      }
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    classes: {
      
    }
  },

  render (h, ctx) {
    let self = ctx.props
    let static_name = `${self.name}${self.staticSuffix}`
    let InputClass = getField(self.type)
    let input = new InputClass(ctx.parent, ctx.props)
    if (self.value[self.name] !== undefined) {
      input.setStaticValue(self.value[self.name])
    }
    if (self.static) {
      return h(self.staticComponent, {props: ctx.props})
    }

    return input.render(h, ctx)
  }
}
