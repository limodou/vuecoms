import {isEmpty, findParent, deepCompare} from '../utils/utils'

export default class Field {
  constructor (parent, options) {
    this.parent = parent //记录父结点
    this.component = options.type //底层组件名,缺省使用type,后续定义的组件可以重定义这个值
    this.defaultOptions = {}
    this.value = options.value || {} //组件值
    this.onChange = options.onChange
    this.enableOnChange = options.enableOnChange
    this.events = ['input'] //记录哪些事件要捕获，当捕获时，自动触发on-validate事件，通知数据进行校验
    this.name = options.name
    this.label = options.label
    this.static = options.static
    this.labelField = options.labelField
    this.options = options.options || {}
    this.on = options.on || {}
    this.multiple = options.multiple
    this.format = options.format
    this.from = options.from  //从value转为控件属性值的方法
    this.to = options.to //从控件值转为value值的方法
    this.staticSuffix = options.staticSuffix
    this.static_name = `${this.name}${this.staticSuffix}`
    this.root = options.root
    if (options.placeholder) {
      this.options.placeholder = options.placeholder
    }
  }

  //处理静态字段
  getStaticValue (value) {
    let v = (value === undefined || value === null) ? '' : value + ''
    return v
  }

  setStaticValue (value, direct=false) {
    let v
    if (!direct)
      v = this.getStaticValue(value)
    else
       v = value
    this.parent.$set(this.value, this.static_name, v)
    if (this.labelField) 
      this.parent.$set(this.value, this.labelField, v)
  }

  setValue (v) {
    this.parent.$set(this.value, this.name, v)
  }

  convert_value (value) {
    //如果是多选，但是value不是数据组，则进行转换
    if (this.multiple && !Array.isArray(value)) return []
    return value
  }

  beforeRender (props) {}

  render (h, ctx) {
    let self = ctx.props
    let value = self.value[self.name]
    // 增加options是函数时的处理
    let opts = this.options
    if (typeof opts === 'function') {
      opts = opts(self.value[self.name], self.name, self.value)
    }
    // 处理select的labelField
    if (this.labelField) {
      value = {label: self.value[this.labelField], value: value}
    } 

    let props = Object.assign({}, this.defaultOptions, {value}, opts)
    let events = {
      input: (x) => {
        x = this.convert_value(x)
        // 检查值是否发生变化
        let old_value = self.value[self.name]
        if (deepCompare(old_value, x)) return

        // ctx.parent.$set(self.value, self.name, x)
        this.setValue(x)
        this.setStaticValue(x)
        ctx.parent.$nextTick(() => {
          if (this.events.indexOf('input') > -1) {
            ctx.listeners['on-validate'] && ctx.listeners['on-validate']()
          }
          // 触发on-field-change事件
          let v = {name: self.name, old: self.value[self.name], value: x}
          let p = findParent(ctx.parent, self.root)
          if (p)
            p.$emit('on-field-change', v)
        })

        // 增加对listenser的处理
        if (this.enableOnChange && this.onChange) {
          ctx.parent.$nextTick(() => {
            this.onChange(x, self.value)
          })
        }
      },
    }
    for(let e_name of this.events) {
      if (e_name === 'input') continue
      events[e_name] = function (...args) {
        ctx.listeners['on-validate'] && ctx.listeners['on-validate']()
      }
    }

    this.beforeRender(props)

    return h(this.component, {
      props,
      on: Object.assign({}, this.on, events)
    })
  }
}
