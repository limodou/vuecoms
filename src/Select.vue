<template>
  <Select v-model="data" :multiple="multiple" @input="handleInput">
    <Option v-for="item in items" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script>
import {Select, Option} from 'iview'

export default {
  name: 'uSelect',
  data () {
    return {data: this.value, items: []}
  },
  created () {
    if (typeof this.choices === 'function' && !this.choices.choices) {
      const callback = (choices) => {
        this.choices.choices = choices
        this.items = choices
      }
      this.choices(callback)
    } else {
      let r = []
      let d
      for(let item of (this.choices || [])) {
        if (Array.isArray(item)) {
          d = {value: item[0], label: item[1]}
        } else if (typeof item === 'object'){
          d = item
        } else {
          d = {value: item, label: item}
        }
        r.push(d)
      }
      this.items = r
    }
  },
  props: [
    'value', 'choices', 'multiple'
  ],

  methods: {
    handleInput () {
      this.$emit('input', this.data)
    }
  }
}
</script>
