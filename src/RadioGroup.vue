<template>
  <RadioGroup v-model="data" @input="handleInput">
    <Radio v-for="item in items" :label="item.value">{{ item.label }}</Option>
  </RadioGroup>
</template>

<script>
import {RadioGroup, Radio} from 'iview'
import {formatChoices} from '@/utils/utils.js'

export default {
  name: 'uRadioGroup',
  data () {
    return {data: this.value, items: []}
  },
  props: [
    'value', 'choices'
  ],

  methods: {
    handleInput () {
      this.$emit('input', this.data)
    }
  },

  watch: {
    value: {
      handler (v) {
        this.data = v
      },
      deep: true
    },
    choices: {
      immediate: true,
      handler () {
        if (typeof this.choices !== 'function') {
          this.items = formatChoices(this.choices)
        }
      },
      deep: true
    }
  }
}
</script>
