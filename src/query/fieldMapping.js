import QueryString from "./queryString.vue"
import QuerySelect from "./querySelect.vue"
import QueryDatepicker from "./queryDatepicker.vue"
import QueryRadio from "./queryRadio.vue"
import QueryCheckbox from "./queryCheckbox.vue"
import QueryTreeSelect from "./queryTreeSelect.vue"
import QueryDatepickerRange from './queryDatepickerRange'

export default {
  str: QueryString,
  iselect: QuerySelect,
  date: QueryDatepicker,
  daterange: QueryDatepickerRange,
  radio: QueryRadio,
  checkbox: QueryCheckbox,
  treeselect: QueryTreeSelect,
}
