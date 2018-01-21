<template>
  <tree-select v-model="val" :multiple="multiple"
    v-bind="options"
    :choices="store.states.choices[tagName]" clearable></tree-select>
</template>

<script>
import {TreeSelect} from 'iview'

export default {
    data: function () {
      let options = this.store.getField(this.tagName)['options'] || {}
      let multiple = this.store.getField(this.tagName)['multiple'] || false
      let val = this.store.getVal(this.tagName)
      return {
        val, options, multiple
      }
    },
    watch: {
      val: function (v) {
        this.store.setVal(this.tagName, v)
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
