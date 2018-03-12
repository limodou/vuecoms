<template>
  <div>
    <DatePicker type="date" v-model="val1" v-bind="options" style="width: 120px;"></DatePicker>
    -
    <DatePicker type="date" v-model="val2" v-bind="options" style="width: 120px;"></DatePicker>
  </div>
</template>

<script>

import {DatePicker} from "iview"
import {mapState, mapMethod, formatDate} from '@/utils/utils.js'

export default {
  data () {
    return {val1: this.store.states.value[this.tagName][0], val2: this.store.states.value[this.tagName][1]}
  },
  methods: {
    ...mapMethod('getField'),
  },
  computed: {
    ...mapState('fields', 'value'),
    options () {
      let opts = Object.assign({}, this.getField(this.tagName))
      delete opts.name
      delete opts.type
      return opts
    }
  },
  props: ["store", "tagName"],
  watch: {
    val1: function(v) {
      this.value[this.tagName][0] = formatDate(v)
    },
    val2: function(v) {
      this.value[this.tagName][1] = formatDate(v)
    },
    'store.states.value': {
      handler: function(v) {
        this.val1 = v[0]
        this.val2 = v[1]
      },
      deep: true
    }
  }
}
</script>
