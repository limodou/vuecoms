import Field from './Field'

export default class RadioField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'u-radio-group'
  }

  getStaticValue (value) {
    let v = ''
    for (let c of this.options.choices) {
      if (c.value == value) {
        v = c.label
        break
      }
    }
    return v
  }
}
