import {alert} from 'vue-strap'

const components = {
  alert
}

Vue.component('alert', alert)

const install = function (Vue, opts = {}) {
    Object.keys(components).forEach((key) => {
        Vue.component(key, components[key])
    })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

module.exports = Object.assign(components, {install});
