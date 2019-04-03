import Field from './Field'
import {text2html} from '../utils/utils.js'

export default class TextField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'Input'
    this.defaultOptions = {type: 'textarea', autosize: {minRows: 5}}
    this.events = ['input', 'on-blur'] //记录哪些事件要抛出
  }

  getStaticValue (value, callback) {
    let v = text2html(value)
    return v
  }

}
