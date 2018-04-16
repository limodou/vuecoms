import Field from './Field'
import {formatChoices} from '@/utils/utils.js'

export default class SelectField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'u-select'
    parent.$set(this.options, 'multiple', this.multiple)
  }

  getStaticValue (value) {
    let v = []
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
