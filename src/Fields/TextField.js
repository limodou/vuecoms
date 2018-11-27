import Field from './Field'
import {text2html} from '../utils/utils.js'

export default class TextField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'Input'
    this.defaultOptions = {type: 'textarea', autosize: {minRows: 5}}
  }

  getStaticValue (value, callback) {
    let v = text2html(value)
    return v
  }

}
