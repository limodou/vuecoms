import Field from './Field'
import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import DatetimeField from './DatetimeField'
import TextField from './TextField'
import TreeSelectField from './TreeSelectField'
import RadioField from './RadioField'
import CheckboxGroupField from './CheckboxGroupField'
import CheckboxField from './CheckboxField'

let fieldMapping = {
  str: InputField,
  select: SelectField,
  date: DateField,
  datetime: DatetimeField,
  text: TextField,
  treeselect: TreeSelectField,
  radio: RadioField,
  checkboxgroup: CheckboxGroupField,
  checkbox: CheckboxField,
}

const getField = function (type) {

  let input = type ? fieldMapping[type] || Field : InputField//如果没找到假设type就是自定义的Field类
  return input
}

export default getField
