export default class Field {
  constructor (options) {
    this.component = 'Input'
    this.defaultOptions = {}
    this.events = ['input'] //记录哪些事件要捕获，当捕获时，自动触发on-validate事件，通知数据进行校验
    this.name = options.name
    this.label = options.label
    this.static = options.static
    this.options = options.options || {}
    this.multiple = options.multiple
    this.display = options.display
    this.convert = options.convert
    if (options.placeholder) {
      this.options.placeholder = options.placeholder
    }
  }

  getStaticValue (value, callback) {
    let v = (value === undefined || value === null) ? '' : value + ''
    callback(v)
  }

  convert_value (value) {
    return value
  }

  render (h, ctx) {
    if (!this.static) {
      return this.renderNormal(h, ctx)
    } else {
      return this.renderStatic(h, ctx)
    }
  }

  renderNormal (h, ctx) {
    let self = ctx.props
    let value = self.value[self.name]
    let props = Object.assign({}, this.defaultOptions, {value}, this.options)
    let events = {
      input: (x) => {
        x = this.convert_value(x)
        ctx.parent.$set(self.value, self.name, x)
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

  renderStatic (h, ctx) {
    let self = ctx.props, display
    let value = self.value[self.name] || ''
    if (this.convert) {
      display = this.convert(value)
    } else {
      display = (self.display !== null && self.display !== undefined) ? self.display : value
    }
    return h('div', {
      'class': {
        'u-generic-input-text': true
      },
      domProps: {
        innerHTML: display || ''
      }
    })
  }

}
