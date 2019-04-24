<template>
  <div v-if="showTitle" class="u-generic-input-text" v-html="display" :title="display" :class="classes"></div>
  <div v-else class="u-generic-input-text" v-html="display"></div>
</template>

<script>
export default {
  name: 'StaticField',
  props: ['value', 'format', 'name', 'staticSuffix', 'showTitle', 'classes'],
  computed: {
    display () {
      let static_name = `${this.name}${this.staticSuffix}`
      let v = this.value[static_name]
      if (v !== undefined && v !== null) {
        if (this.format) {
          v = this.format(v, this.value[this.name], this.value)
        }
      } else {
        v = ''
      }
      return v
    },
    title () {
      let showTitle = this.showTitle
      if (showTitle) {
        if (typeof showTitle === 'function') {
          //调用原始值及format值
          return showTitle(this.value, this.display)
        } else {
          return this.value
        }
      }
    }
  }
}
</script>

<style lang="less">
.u-generic-input-text {
  padding: 0 4px;
}
</style>
