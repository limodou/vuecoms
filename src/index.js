import Box from './Box'
import Grid from './Table'
import QueryForm from './query'
import uSelect from './Select'
import {Build, Layout, FormCell, GenericInput} from './Build'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'

const vuecoms = {
  Box,
  Grid,
  QueryForm,
  uSelect,
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
