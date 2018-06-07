<template>
  <div v-if="showTitle" class="u-generic-input-text" v-html="display" :title="display"></div>
  <div v-else class="u-generic-input-text" v-html="display"></div>
</template>

<script>
export default {
  name: 'StaticField',
  props: ['value', 'format', 'name', 'staticSuffix', 'showTitle'],
  computed: {
    display () {
      let static_name = `${this.name}${this.staticSuffix}`
      let v = this.value[static_name]
      if (v !== undefined && v !== null) {
        if (this.format) {
          v = this.format(v)
        }
      }
      return v
    }
  }
}
</script>

<style lang="less">
.u-generic-input-text {
  padding: 0 4px;
}
</style>
