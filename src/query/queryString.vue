/**
* Created by HoseaLee on 17/9/18.
*/

<template>
  <Input v-model="val" v-bind:value="val" :placeholder="placeholder"/>
</template>

<script>

  import { Input } from "iview"

  export default {
    data () {
      let val = this.store.states.value[this.tagName] || "",
        placeholder = this.store.getField(this.tagName)['placeholder']?this.store.getField(this.tagName)['placeholder']:"请输入...";

      return {
        placeholder,
        val
      }
    },
    mounted(){},
    methods: {},
    computed: {},
    watch: {
      val:function(v){
        this.store.setVal(this.tagName, v);
      },
      "store.states.value":{
        handler:function(o,v){
          if(o[this.tagName] != this.val){
            this.val = o[this.tagName]
          }
        },
        deep: true
      }
    },
    components: {Input},
    props: ["store", "tagName"]
  }
</script>
