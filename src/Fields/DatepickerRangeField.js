import Field from './Field'

export default class DatepickerRangeField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'datepicker-range'
  }

  getStaticValue (value) {
    return value.join(' - ')
  }
}
