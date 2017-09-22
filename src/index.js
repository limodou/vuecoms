import {alert} from 'vue-strap'

let vuecoms = {
  'uiAlert': alert
}

const install = function (Vue, opts = {}) {
    Object.keys(vuecoms).forEach((key) => {
        Vue.component(key, vuecoms[key])
    })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

module.exports = vuecoms
