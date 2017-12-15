import Field from './Field'
import {isDate} from '@/utils/utils.js'

export default class DateField extends Field {
  constructor (options) {
    super(options)
    this.component = 'DatePicker'
    this.defaultOptions = {transfer: true}
    this.events = ['input']
  }

  convert_value (x) {
    if (x instanceof Date){
      return `${x.getFullYear()}/${x.getMonth()+1}/${x.getDate()}`
    }
    if (isDate(x)) {
      return x
    }
    return ''
  }
}
