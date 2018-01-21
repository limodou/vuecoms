import Box from './Box'
import {Grid, Buttons} from './Table'
import QueryForm from './query'
import Uploader from './uploader'
import uSelect from './Select'
import uRadioGroup from './RadioGroup'
import uCheckboxGroup from './CheckboxGroup'
import {Build, Layout, FormCell, GenericInput} from './Build'
import './styles/iview.fix.css'

const vuecoms = {
  Box,
  Grid,
  Buttons,
  QueryForm,
  Uploader,
  uSelect,
  uRadioGroup,
  uCheckboxGroup,
  Build,
  Layout,
  FormCell,
  GenericInput
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
