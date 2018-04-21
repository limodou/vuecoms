import Box from './Box'
import {Grid, Buttons} from './Table'
import {Query} from './query'
import Uploader from './uploader'
import uSelect from './Select'
import uRadioGroup from './RadioGroup'
import uCheckboxGroup from './CheckboxGroup'
import {Build, Layout, FormCell} from './Build'
import GenericInput from './Fields'
import './styles/iview.fix.css'
import List from "@/utils/list.js"
import Chart from './EChart'
// import CKEditor from './Editor/CKEditor'
import TinyMce from './Editor/TinyMce'

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
  Layout,
  FormCell,
  GenericInput,
  Chart,
//   ckeditor: CKEditor
  tinymce: TinyMce
}

const install = function () {
    Object.keys(vuecoms).forEach((key) => {
        Vue.component(key, vuecoms[key])
    })
    Vue.prototype.$list = List
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = vuecoms
