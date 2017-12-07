/**
* Created by HoseaLee on 17/9/18.
*/

<template>
    <Input v-model="val" v-bind:value="val" :placeholder="placeholder"/>
</template>

<script>

    import { Input } from "iview"

    let mapState = (...names) => {
        let r = {}
        for(let name of names) {
            r[name] = function mappedState() {
                return this.store.states[name]
            }
        }
        return r
    }

    export default {
        data () {
            let val = this.store.states.value[this.tagName] || "",
                    placeholder = this.store.getField(this.tagName)['placeholder']?this.store.getField(this.tagName)['placeholder']:"请输入...";

        let rrr = {
                ...mapState('columns', 'columnResizing', 'checkCol',
                    'gridWidth', 'width', 'resizable', 'columnPosition', 'guiderHeight',
                    'defaultColWidth', 'leftWidth', 'checkColTitle', 'checkColWidth',
                    'indexColWidth', 'indexColTitle', 'scrollLeft', 'total', 'pageSizeOpts',
                    'pagination', 'loading', 'loadingText', 'loadingTop', 'loadingLeft',
                    'autoLoad', 'url', 'param')
        }
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
