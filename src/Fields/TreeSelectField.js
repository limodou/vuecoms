import Field from './Field'
import {formatChoices} from '../utils/utils.js'

export default class TreeSelectField extends Field {
  constructor (parent, options) {
    super(parent, options)
    this.component = 'tree-select'
    if (this.multiple !== undefined)
      parent.$set(this.options, 'multiple', this.multiple)
    this.events = ['input', 'close']
    this.defaultOptions = {transfer: true}
  }

  getStaticValue (value) {
    if (!value) return ''
    if (this.multiple && value.length === 0) return ''
    const find = (choices, value, result, selected) => {
      if (!choices || choices.length === 0) return
      for (let c of choices) {
        if (Array.isArray(value)) {
          if (value.indexOf(c.id) > -1) {
            result.push(c.title)
            selected.push({label:c.title, value:c.id})
            if (!this.multiple) break
          }
        } else if (c.id == value) {
          result.push(c.title)
          selected.push({label:c.title, value:c.id})
          if (this.multiple) break
        }
        if (c.children && c.children.length > 0) {
          find(c.children, value, result, selected)
        }
      }
    }

    let v = []
    let selected = []
    find(this.options.choices, value, v, selected)
    if (selected.length === 0) return ''

    // 设置tree的初始值
    let child
    for (child of this.parent.$children) {
      if (child.$options.name === 'TreeSelect') {
        if (this.multiple) {
          child.selectedMultiple = selected
        } else {
          child.selectedSingle = selected[0].label
        }
      }
    }
    return v.join(', ')
  }
}
