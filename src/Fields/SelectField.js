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

  setValue (v) {
    let value = v
    if (!this.options.rich) {
      if (Array.isArray(v)) {
        value = v.map(x => x.value)
      } else if (v instanceof Object) {
        value = v.value
      } else {
        value = v
      }
    }
    this.parent.$set(this.value, this.name, value)
  }

  beforeRender (props) {
    props['rich'] = true
  }

  getStaticValue (value) {
    let v, pv
    if (Array.isArray(value)) {
      if (value.length == 0) return ''
      if (value[0] instanceof Object) {
        return value.map(x => x.label).join(', ')
      }
      // 继续处理
      pv = value
    } else {
      if (!value) return ''
      if (value instanceof Object)
        return value.label
      pv = [value]
    }
    v = []
    for (let c of formatChoices(this.options.choices)) {
      if (pv.indexOf(c.value) > -1) {
        v.push(c.label)
        if (!Array.isArray(value)) break
      }
    }

    return v.join(', ')
  }
}
