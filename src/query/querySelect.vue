/**
* Created by HoseaLee on 17/9/18.
*/

<template>

    <Select v-model="val" :value="val" :clearable="clearable" :disabled="disabled" :filterable="filterable" :size="size" :placeholder="placeholder" v-if="!isMultiple">
        <Option v-for="item in store.states.choices[tagName]" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>

    <Select v-model="val" :value="val" :disabled="disabled" :filterable="filterable" :size="size" :placeholder="placeholder" multiple v-else>
        <Option v-for="item in store.states.choices[tagName]" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>

</template>

<script>

    import { Select, Option } from "iview"
    import Emitter from '@/mixins/emitter.js'

    export default {
        data () {
            let val, multipleVal, defaultVal, isMultiple, disabled, clearable, allowCreate, filterable, size, cityList, placeholder;
            isMultiple = this.store.getField(this.tagName)['multiple'] ? this.store.getField(this.tagName)['multiple'] : false;
            disabled = this.store.getField(this.tagName)['disabled'] ? this.store.getField(this.tagName)['disabled'] : false;
            clearable = this.store.getField(this.tagName)['clearable'] ? this.store.getField(this.tagName)['clearable'] : false;
            allowCreate = this.store.getField(this.tagName)['allowCreate'] ? this.store.getField(this.tagName)['allowCreate'] : false;
            filterable = this.store.getField(this.tagName)['filterable'] ? this.store.getField(this.tagName)['filterable'] : false;
            size = this.store.getField(this.tagName)['size'] ? this.store.getField(this.tagName)['size'] : "default"
            cityList = this.store.getField(this.tagName)['choices']
            placeholder = this.store.getField(this.tagName)['placeholder']?this.store.getField(this.tagName)['placeholder']:"请选择";


            defaultVal = isMultiple ? [] : "";
            val = this.store.getVal(this.tagName);
            // "" undefined null and multiple
            if(isMultiple && (val==""|| val==undefined || val==null)) {
                val = [];
            }
            // a string and multiple
            if(isMultiple && (typeof val == "string")){
                val = [val];
            }

            return {
                defaultVal,
                isMultiple,
                disabled,
                clearable,
                allowCreate,
                filterable,
                val,
                multipleVal,
                size,
                cityList,
                placeholder
            }
        },
        mixins: [Emitter],
        mounted(){
        },
        methods: {},
        computed: {},
        watch: {
            val: function (v, ov) {
                this.store.setVal(this.tagName, v);
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
        components: {Select, Option},
        props: ["store", "tagName"]
    }
</script>
