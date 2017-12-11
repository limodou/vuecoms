import Field from './Field'

export default class SelectField extends Field {
  constructor (options) {
    super(options)
    this.component = 'u-select'
  }

  getStaticValue (value, callback) {
    let v
    for (let c of this.options.choices) {
      if (c.value == value) {
        callback(c.label)
      }
    }
  }
}
