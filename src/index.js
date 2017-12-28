import Box from './Box'
import Grid from './Table'
import QueryForm from './query'
import Uploader from './uploader'
import uSelect from './Select'
import uRadioGroup from './RadioGroup'
import uCheckboxGroup from './CheckboxGroup'
import {Build, Layout, FormCell, GenericInput} from './Build'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'
import './styles/treeselect.fix.css'
import './styles/iview.fix.css'

const vuecoms = {
  Box,
  Grid,
  QueryForm,
  Uploader,
  uSelect,
  uRadioGroup,
  uCheckboxGroup,
  Build,
  Layout,
  FormCell,
  GenericInput,
  Treeselect
}

const install = function () {
    Object.keys(vuecoms).forEach((key) => {
        Vue.component(key, vuecoms[key])
    })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = vuecoms
