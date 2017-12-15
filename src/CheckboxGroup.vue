<template>
  <CheckboxGroup v-model="data" @input="handleInput">
    <Checkbox v-for="item in items" :label="item.value">{{ item.label }}</Checkbox>
  </CheckboxGroup>
</template>

<script>
import {CheckboxGroup, Checkbox} from 'iview'

export default {
  name: 'uCheckboxGroup',
  components: {
    CheckboxGroup,
    Checkbox
  },
  data () {
    return {data: this.value}
  },
  computed: {
    items () {
      let r = []
      let d
      for(let item of (this.choices || [])) {
        if (Array.isArray(item)) {
          // 当数组只有一维时，label和value一致
          d = {value: item[0], label: item[1] || item[0]}
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
