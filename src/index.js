import Box from './Box.vue'
import {Grid, Buttons} from './Table'
import Query from './Query'
import Uploader from './uploader'
import uSelect from './Select.vue'
import uRadioGroup from './RadioGroup.vue'
import uCheckboxGroup from './CheckboxGroup.vue'
import {Build, BuildLayout, FormCell} from './Build'
import GenericInput from './Fields'
import './styles/iview.fix.css'
import './styles/common.css'
import List from "./utils/list.js"
import {findParent} from "./utils/utils.js"
import Chart from './EChart'
// import CKEditor from './Editor/CKEditor'
import TinyMce from './Editor/TinyMce'
import DatepickerRange from './DatepickerRange.vue'
//third-party plugin
import uTemplate from "v-runtime-template"
import VueScrollTo from 'vue-scrollto'

const Components = {
  Box,
  Grid,
  Buttons,
  Query,
  Uploader,
  uSelect,
  uRadioGroup,
  uCheckboxGroup,
  Build,
  BuildLayout,
  FormCell,
  GenericInput,
  Chart,
//   ckeditor: CKEditor
  tinymce: TinyMce,
  DatepickerRange,
  uTemplate
}

const install = function (Vue) {
  if (install.installed) return;
  Object.keys(Components).forEach((name) => {
    Vue.component(name, Components[name])
  })
  Vue.prototype.$list = List
  Vue.prototype.$findParent = findParent
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
window.VueScrollTo = VueScrollTo;

export default {
  install,
  ...Components
}