import Field from './Field'
import {isDate, formatDate} from '../utils/utils.js'

export default class DateField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'DatePicker'
    this.defaultOptions = {transfer: true}
    this.events = ['input']
  }

  convert_value (x) {
    if (x instanceof Date){
      return formatDate(x, 'yyyy/MM/dd')
    }
    if (isDate(x)) {
      return x
    }
    return ''
  }
}
