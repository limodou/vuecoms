import {alert} from 'vue-strap'
import Box from './Box'

let vuecoms = {
  uiAlert: alert,
  uiBox: Box
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

export vuecoms
