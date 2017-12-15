import Field from './Field'

export default class SelectField extends Field {
  constructor (options) {
    super(options)
    this.component = 'u-select'
    this.options.multiple = this.multiple
  }

  _getValue (value, choices, callback) {
    let v = []
    for (let c of choices) {
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

  getStaticValue (value, callback) {
    if (typeof this.options.choices === 'function') {
      if (!this.options.choices.choices) {
        const _callback = (choices) => {
          this.options.choices.choices = choices
          this._getValue(value, choices, callback)
        }
        this.options.choices(_callback)
      } else {
        this._getValue(value, this.options.choices.choices, callback)
      }
    } else {
      this._getValue(value, this.options.choices, callback)
    }
  }
}
