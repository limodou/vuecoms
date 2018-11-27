import Field from './Field'
import {formatChoices} from '../utils/utils.js'

export default class SelectField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'u-select'
    this.selectedName = `${this.name}_selected` //用于存放selected值，供下次使用
    if (this.multiple !== undefined)
      parent.$set(this.options, 'multiple', this.multiple)
  }

  convert_value (value) {
    if (this.options.remote) {
      let v = value
      // keeprich 为保持原始格式
      if (this.options.rich) {
        value = v
      } else {
        value = v.map(x => x.value)
      }
      // 保存上次的selected值
      this.value[this.selectedName] = v
    }
    return value
  }

  beforeRender (props) {
    if (this.options.remote) {
      let v = this.value[this.selectedName] || this.value[this.name]
      props['value'] = v
      props['rich'] = true
    }
  }

  getStaticValue (value) {
    let v
    if (this.options.remote) {
      v = this.value[this.selectedName]
      //如果富格式，则视为options的值
      if (!v && this.options.rich) {
        v = this.value[this.name]
      }
      if (!v) return ''
      if (this.multiple) {
        return v.map(x => x.label).join(', ')
      } else {
        if (v instanceof Object) {
          return v.label
        } else {
          return v
        }
      }
    }
    v = []
    for (let c of formatChoices(this.options.choices)) {
      if (Array.isArray(value)) {
        if (value.indexOf(c.value) > -1) {
          v.push(c.label)
          if (!this.multiple) break
        }
      } else if (c.value == value) {
        v.push(c.label)
        if (this.multiple) break
      }
    }
    return v.join(', ')
  }
}
