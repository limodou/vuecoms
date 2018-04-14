import Field from './Field'
import {isDate, formatDate} from '@/utils/utils.js'

export default class DatetimeField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'DatePicker'
    this.defaultOptions = {transfer: true, type: 'datetime'}
    this.events = ['input']
  }

  convert_value (x) {
    if (x instanceof Date){
      return formatDate(x, 'yyyy/MM/dd hh:mm:ss')
    }
    if (isDate(x)) {
      return x
    }
    return ''
  }
}
