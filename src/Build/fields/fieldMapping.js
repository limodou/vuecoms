import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import TextField from './TextField'
import TreeSelectField from './TreeSelectField'

let fieldMapping = {
  string: InputField,
  select: SelectField,
  date: DateField,
  text: TextField,
  treeselect: TreeSelectField
}

export const getField = function (type) {
  let input = fieldMapping[type] || Field
  return input
}
