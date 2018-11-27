import Box from './Box'
import {Grid, Buttons} from './Table'
import Query from './query'
import Uploader from './uploader'
import uSelect from './Select'
import uRadioGroup from './RadioGroup'
import uCheckboxGroup from './CheckboxGroup'
import {Build, BuildLayout, FormCell} from './Build'
import GenericInput from './Fields'
import './styles/iview.fix.css'
import './styles/common.css'
import List from "@/utils/list.js"
import {findParent} from "@/utils/utils.js"
import Chart from './EChart'
// import CKEditor from './Editor/CKEditor'
import TinyMce from './Editor/TinyMce'
import DatepickerRange from './DatepickerRange'
//third-party plugin
import uTemplate from "v-runtime-template"
import VueScrollTo from 'vue-scrollto'

const vuecoms = {
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

const install = function () {
    Object.keys(vuecoms).forEach((key) => {
        Vue.component(key, vuecoms[key])
    })
    Vue.prototype.$list = List
    Vue.prototype.$findParent = findParent
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
window.VueScrollTo = VueScrollTo;

module.exports = vuecoms;
