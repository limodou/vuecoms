import Field from './Field'

export default class CheckboxGroupField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'u-checkbox-group'
  }

  getStaticValue (value) {
    let v = []
    for (let c of this.options.choices) {
      if (Array.isArray(value)) {
        if (value.indexOf(c.value) > -1) {
          v.push(c.label)
        }
      } else if (c.value == value) {
        v.push(c.label)
      }
    }
    return v.join(', ')
  }
}
