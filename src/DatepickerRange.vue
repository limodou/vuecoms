<template>
  <div>
    <DatePicker type="date" v-model="val1" transfer :placeholder="placeholderBegin" style="width: 120px;"></DatePicker>
    -
    <DatePicker type="date" v-model="val2" transfer :placeholder="placeholderEnd" style="width: 120px;"></DatePicker>
  </div>
</template>

<script>

import {DatePicker} from "iview"
import {formatDate} from '@/utils/utils.js'

export default {
  name: 'DatepickerRange',
  data () {
    return this.parseDate(this.value)
  },
  props: {
    value: Array,
    placeholderBegin: String,
    placeholderEnd: String,
  },
  methods: {
    parseDate (v) {
      let val1, val2
      if (!v || v.length === 0) {
        val1 = ''
        val2 = ''
      } else {
        val1 = v[0]
        val2 = v[1]
      }
      return {val1, val2}
    }
  },
  watch: {
    val1: function(v) {
      this.$emit('input', [formatDate(this.val1), formatDate(this.val2)])
    },
    val2: function(v) {
      this.$emit('input', [formatDate(this.val1), formatDate(this.val2)])
    },
    value: {
      handler: function(v) {
        let d = this.parseDate(v)
        this.val1 = d['val1']
        this.val2 = d['val2']
      },
      deep: true
    }
  }
}
</script>
