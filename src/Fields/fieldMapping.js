import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import TextField from './TextField'
import TreeSelectField from './TreeSelectField'
import RadioField from './RadioField'
import CheckboxGroupField from './CheckboxGroupField'
import CheckboxField from './CheckboxField'
import StaticField from './StaticField'

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

let staticFieldMapping = {
  static: StaticField
}
const getField = function (type, static_type='static') {
  let input = fieldMapping[type] || type || InputField//如果没找到假设type就是自定义的Field类
  let static_input = staticFieldMapping[static_type] || StaticField
  return {field: input, static: static_input}
}

export default getField
