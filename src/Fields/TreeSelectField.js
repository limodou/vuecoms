import Field from './Field'

export default class TreeSelectField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'tree-select'
    parent.$set(this.options, 'multiple', this.multiple)
    this.events = ['close']
  }

  getStaticValue (value) {
    let v = []
    for (let c of this.options.choices) {
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
