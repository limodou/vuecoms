import Box from './Box.vue'

const vuecoms = {
  Box
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
