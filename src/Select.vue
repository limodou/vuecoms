<template>
  <Select v-model="data" :multiple="multiple" @input="handleInput" 
    :clearable="clearable" :filterable="filterable" transfer :remote="remote"
    :loading="loading" :remote-method="handleRemote">
    <Option v-for="item in items" :value="item.value" :key="item.value + item.label" :label="item.label">{{ item.label }}</Option>
  </Select>
</template>

<script>
import {Select, Option} from 'iview'
import {formatChoices} from '@/utils/utils.js'

export default {
  name: 'uSelect',
  data () {
    return {data: this.value, items: [], loading: false}
  },

  props: [
    'value', 'choices', 'multiple', 'clearable', 'filterable', 'remote', 'remoteMethod'
  ],

  methods: {
    handleInput () {
      this.$emit('input', this.data)
    },
    handleRemote (query) {
      this.loading = true
      const callback = items => {
        this.items = formatChoices(items)
        this.loading = false
      }
      if (this.remoteMethod) {
        this.remoteMethod(query, callback)
      }
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
