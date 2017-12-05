<template>
  <Select v-model="data" @input="handleInput">
    <Option v-for="item in items" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script>
export default {
  name: 'uSelect',
  data () {
    return {data: this.value}
  },
  computed: {
    items () {
      let r = []
      let d
      for(let item of (this.options.choices || [])) {
        if (Array.isArray(item)) {
          d = {value: item[0], label: item[1]}
        } else if (typeof item === 'object'){
          d = item
        } else {
          d = {value: item, label: item}
        }
        r.push(d)
      }
      return r
    }
  },
  props: {
    value: {},
    options: Object
  },
  methods: {
    handleInput () {
      this.$emit('input', this.data)
    }
  }
}
</script>

<style>

</style>
