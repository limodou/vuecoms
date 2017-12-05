/**
* Created by HoseaLee on 17/9/18.
*/

<template>
    <DatePicker type="date" v-model="val" :value="val" :format="format" :transfer="transfer" :readonly="readonly" :clearable="clearable" :editable="editable" :options="options" :placeholder="placeholder" :confirm="confirm" :size="size" :placement="placement" :disabled="disabled" v-if="store.getField(tagName)['type']=='date'"></DatePicker>
</template>

<script>

    import { DatePicker } from "iview"

    export default {
        data () {
            let val = this.store.states.value[this.tagName] || "",
                    placeholder = this.store.getField(this.tagName).hasOwnProperty("placeholder")?this.store.getField(this.tagName)['placeholder']:"请选择日期",
                    format = this.store.getField(this.tagName).hasOwnProperty("format")?this.store.getField(this.tagName)['format']:"yyyy/MM/dd",
                    options = this.store.getField(this.tagName).hasOwnProperty("options")?this.store.getField(this.tagName)['options']:{},
                    confirm = this.store.getField(this.tagName).hasOwnProperty("confirm")?this.store.getField(this.tagName)['confirm']:false,
                    size = this.store.getField(this.tagName).hasOwnProperty("size")?this.store.getField(this.tagName)['size']:"default",
                    disabled = this.store.getField(this.tagName).hasOwnProperty("disabled")?this.store.getField(this.tagName)['disabled']:false,
                    placement = this.store.getField(this.tagName).hasOwnProperty("placement")?this.store.getField(this.tagName)['placement']:"bottom-start",
                    readonly = this.store.getField(this.tagName).hasOwnProperty("readonly")?this.store.getField(this.tagName)['readonly']:false,
                    editable = this.store.getField(this.tagName).hasOwnProperty('editable')?this.store.getField(this.tagName)['editable']: true,
                    clearable = this.store.getField(this.tagName).hasOwnProperty("clearable")?this.store.getField(this.tagName)['clearable']:false,
                    transfer = this.store.getField(this.tagName).hasOwnProperty("transfer")?this.store.getField(this.tagName)['transfer']: false;

            return {
                val,
                placeholder,
                format,
                options,
                confirm,
                size,
                disabled,
                placement,
                readonly,
                editable,
                clearable,
                transfer
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
        components: {DatePicker},
        props: ["store", "tagName"]
    }
</script>
