import Box from './Box.vue'
import Grid from './Table'
import QueryForm from "./query"

const vuecoms = {
  Box,
  Grid,
  QueryForm
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
