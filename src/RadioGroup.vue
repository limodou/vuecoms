<template>
  <RadioGroup v-model="data" @input="handleInput">
    <Radio v-for="item in items" :label="item.value">{{ item.label }}</Option>
  </RadioGroup>
</template>

<script>
import {RadioGroup, Radio} from 'iview'

export default {
  name: 'uRadioGroup',
  data () {
    return {data: this.value}
  },
  computed: {
    items () {
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
      return r
    }
  },
  props: [
    'value', 'choices'
  ],

  methods: {
    handleInput () {
      this.$emit('input', this.data)
    }
  }
}
</script>
