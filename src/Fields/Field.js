export default class Field {
  constructor (parent, options) {
    this.parent = parent //记录父结点
    this.component = 'Input' //底层组件名
    this.defaultOptions = {}
    this.value = options.value || {} //组件值
    this.events = ['input'] //记录哪些事件要捕获，当捕获时，自动触发on-validate事件，通知数据进行校验
    this.name = options.name
    this.label = options.label
    this.static = options.static
    this.options = options.options || {}
    this.multiple = options.multiple
    this.format = options.format
    this.from = options.from  //从value转为控件属性值的方法
    this.to = options.to //从控件值转为value值的方法
    this.staticSuffix = options.staticSuffix
    this.static_name = `${this.name}${this.staticSuffix}`
    if (options.placeholder) {
      this.options.placeholder = options.placeholder
    }
  }

  //处理静态字段
  getStaticValue (value) {
    let v = (value === undefined || value === null) ? '' : value + ''
    return v
  }

  setStaticValue (value) {
    this.parent.$set(this.value, this.static_name, this.getStaticValue(value))
  }

  convert_value (value) {
    return value
  }

  render (h, ctx) {
    let self = ctx.props
    let value = self.value[self.name]
    let props = Object.assign({}, this.defaultOptions, {value}, this.options)
    let events = {
      input: (x) => {
        x = this.convert_value(x)
        ctx.parent.$set(self.value, self.name, x)
        this.setStaticValue(x)
        ctx.parent.$nextTick(() => {
          if (this.events.indexOf('input') > -1)
            ctx.listeners['on-validate'] && ctx.listeners['on-validate']()
        })
      }
    }
    for(let e_name of this.events) {
      if (e_name === 'input') continue
      events[e_name] = function (...args) {
        ctx.listeners['on-validate'] && ctx.listeners['on-validate']()
      }
    }

    return h(this.component, {
      props,
      on: events
    })
  }
}
