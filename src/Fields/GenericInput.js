import getField from './fieldMapping'

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
    }
  },

  render (h, ctx) {
    let self = ctx.props
    let static_name = `${self.name}${self.staticSuffix}`
    let Input = getField(self.type)
    let input = new Input.field(ctx.parent, ctx.props)
    if (self.static) {
      //判断是否有name_static值，如果有，则不再执行getStaticValue的方法
      let v = self.value[`${self.name}${self.staticSuffix}`]
      if (!v)
        input.setStaticValue(self.value[self.name])
    }
    if (self.static) {
      return h(Input.static, {props: ctx.props})
    } else {
      return input.render(h, ctx)
    }
  }
}
