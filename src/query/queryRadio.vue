/**
* Created by HoseaLee on 17/9/18.
*/

<template>
    <RadioGroup v-model="val" v-bind:value="val" :type="type" :size="size" :vertical="vertical">
        <Radio v-for="r,i in cityList" :label="r['label']" :key="i" :disabled="disabled||(r.hasOwnProperty('disabled')?r['disabled']:false)">{{r['name']}}</Radio>
    </RadioGroup>
</template>

<script>

    import { RadioGroup, Radio } from "iview"

    export default {
        data () {
            let val = this.store.states.value[this.tagName] || "",
                    cityList = this.store.getField(this.tagName)['choices'],
                    type = this.store.getField(this.tagName).hasOwnProperty('rType')?this.store.getField(this.tagName)['rType']:null,
                    disabled = this.store.getField(this.tagName).hasOwnProperty('disabled')?this.store.getField(this.tagName)['disabled']:false,
                    size = this.store.getField(this.tagName).hasOwnProperty('size')?this.store.getField(this.tagName)['size']:"default",
                    vertical = this.store.getField(this.tagName).hasOwnProperty("vertical")?this.store.getField(this.tagName)['vertical']:false

            return {
                val,
                cityList,
                type,
                disabled,
                size,
                vertical
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
        components: {RadioGroup, Radio},
        props: ["store", "tagName"]
    }
</script>
