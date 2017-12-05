import Box from './Box'
import Grid from './Table'
import QueryForm from './query'
import uSelect from './Select'

const vuecoms = {
  Box,
  Grid,
  QueryForm,
  uSelect
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
