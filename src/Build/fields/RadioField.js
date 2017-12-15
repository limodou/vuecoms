import Field from './Field'

export default class RadioField extends Field {
  constructor (options) {
    super(options)
    this.component = 'u-radio-group'
  }

  getStaticValue (value, callback) {
    let v = ''
    for (let c of this.options.choices) {
      if (c.value == value) {
        v = c.label
        break
      }
    }
    callback(v)
  }
}
