import InputField from './InputField'
import SelectField from './SelectField'
import DateField from './DateField'
import TextField from './TextField'

let fieldMapping = {
  string: InputField,
  select: SelectField,
  date: DateField,
  text: TextField,
}

export const getField = function (type) {
  let input = fieldMapping[type] || Field
  return input
}
