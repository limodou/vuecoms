import Field from './Field'

export default class SelectField extends Field {
  constructor (options) {
    super(options)
    this.component = 'u-select'
    this.options.multiple = this.multiple
  }

  getStaticValue (value, callback) {
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
    callback(v.join(', '))
  }
}
