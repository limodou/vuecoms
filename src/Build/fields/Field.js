export default class Field {
  constructor (options) {
    this.component = 'Input'
    this.defaultOptions = {}
    this.name = options.name
    // this.label = options.label
    this.static = options.static
    this.options = options.options
    this.multiple = options.multiple
    this.display = options.display
    this.convert = options.convert

    this._old_value = null
    this._old_static_value = ''
  }

  getCachedStaticValue (value, callback) {
    let v
    if (value === this._old_value && this._old_static_value) {
      v = this._old_static_value
      callback(v)
    } else {
      let c = (v) => {
        this._old_value = value
        this._old_static_value = v
        callback(v)
      }
      this.getStaticValue(value, c)
    }
  }

  getStaticValue (value, callback) {
    let v = value + ''
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
    let props = Object.assign(this.defaultOptions, {value}, this.options)
    return h(this.component, {
      props,

      on: {
        input: (x) => {
          x = this.convert_value(x)
          ctx.parent.$set(self.value, self.name, x)
          ctx.parent.$parent.$emit('input', x)
        }
      }
    })
  }

  renderStatic (h, ctx) {
    let self = ctx.props, display
    let value = self.value[self.name]
    if (this.convert) {
      display = this.convert(value)
    }
    else {
      display = typeof self.display !== null ? self.display : value
    }
    return h('span', {
      'class': {
        'u-generic-input-text': true
      },
      domProps: {
        innerHTML: display
      }
    })
  }

}
