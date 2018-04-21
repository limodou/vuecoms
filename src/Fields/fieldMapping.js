import Field from './Field'
import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import DatetimeField from './DatetimeField'
import DatepickerRangeField from './DatepickerRangeField'
import TextField from './TextField'
import TreeSelectField from './TreeSelectField'
import RadioField from './RadioField'
import CheckboxGroupField from './CheckboxGroupField'
import CheckboxField from './CheckboxField'

let fieldMapping = {
  str: InputField,
  string: InputField,
  select: SelectField,
  date: DateField,
  datetime: DatetimeField,
  datepickerrange: DatepickerRangeField,
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
