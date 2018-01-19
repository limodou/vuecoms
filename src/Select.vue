<template>
  <Select v-model="data" :multiple="multiple" @input="handleInput" :clearable="clearable">
    <Option v-for="item in items" :value="item.value" :key="item.value + item.label" :label="item.label">{{ item.label }}</Option>
  </Select>
</template>

<script>
import {Select, Option} from 'iview'

// 格式化choices, 转对对象形式
const formatChoices = function (choices) {
  let r = []
  let d
  for(let item of (choices || [])) {
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

export default {
  name: 'uSelect',
  data () {
    return {data: this.value, items: []}
  },
  created () {
    if (typeof this.choices === 'function' && !this.choices.choices) {
      const callback = (choices) => {
        this.choices.choices = choices
        this.items = formatChoices(choices)
      }
      this.choices(callback)
    }
  },
  props: [
    'value', 'choices', 'multiple', 'clearable'
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
