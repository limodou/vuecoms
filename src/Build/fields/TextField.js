import Field from './Field'
import {text2html} from '@/utils/utils.js'

export default class TextField extends Field {
  constructor (options) {
    super(options)
    this.component = 'Input'
    this.defaultOptions = {type: 'textarea', autosize: true, rows: 4}
  }

  getStaticValue (value, callback) {
    let v = text2html(value)
    callback(v)
  }

}
