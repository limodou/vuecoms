<template>
  <tree-select v-model="val" :multiple="multiple"
    v-bind="options"
    :choices="store.states.choices[tagName]" clearable></tree-select>
</template>

<script>
import {TreeSelect} from 'iview'
import Emitter from '@/mixins/emitter.js'

export default {
    data: function () {
      let options = this.store.getField(this.tagName)['options'] || {}
      let multiple = this.store.getField(this.tagName)['multiple'] || false
      let val = this.store.getVal(this.tagName)
      return {
        val, options, multiple
      }
    },
    mixins: [Emitter],
    watch: {
      val: function (v, ov) {
        this.store.setVal(this.tagName, v)
        let d = {name: this.tagName, old: ov, value: v}
        this.dispatch('Query', 'on-query-change', d)
      },
      "store.states.value": {
        handler: function (o, v) {
          if (o[this.tagName] != this.val) {
            this.val = o[this.tagName]
          }
        },
        deep: true
      }
    },
    components: {
      TreeSelect
    },
    props: ["store", "tagName"]
  }
</script>
