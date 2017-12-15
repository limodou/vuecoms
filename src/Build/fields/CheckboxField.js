import Field from './Field'

export default class CheckboxField extends Field {
  constructor (options) {
    super(options)
    this.component = 'checkbox'
  }

  getStaticValue (value, callback) {
    let v = ''
    if (value) {
      v = '<i class="ivu-icon ivu-icon-android-checkbox-outline"></i>'
    } else {
      v = '<i class="ivu-icon ivu-icon-android-checkbox-outline-blank"></i>'
    }
    callback(v)
  }
}
