import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import TextField from './TextField'
import TreeSelectField from './TreeSelectField'
import RadioField from './RadioField'
import CheckboxGroupField from './CheckboxGroupField'
import CheckboxField from './CheckboxField'

let fieldMapping = {
  string: InputField,
  select: SelectField,
  date: DateField,
  text: TextField,
  treeselect: TreeSelectField,
  radio: RadioField,
  checkboxgroup: CheckboxGroupField,
  checkbox: CheckboxField
}

export const getField = function (type) {
  let input = fieldMapping[type] || type || InputField//如果没找到假设type就是自定义的Field类
  return input
}
