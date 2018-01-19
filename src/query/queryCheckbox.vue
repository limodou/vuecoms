/**
* Created by HoseaLee on 17/9/18.
*/

<template>
    <CheckboxGroup v-model="val" :size="size">
        <template v-for="c,i in store.states.choices[tagName]">
            <Checkbox :label="c['label']" :disabled="disabled||(c.hasOwnProperty('disabled')?c['disabled']:false)">
                <span>{{c['name']}}</span>
            </Checkbox>
        </template>
    </CheckboxGroup>
</template>

<script>

    import {CheckboxGroup, Checkbox} from "iview"

    export default {
        data () {
            let val = this.store.states.value[this.tagName] || [],
                    cityList = this.store.getField(this.tagName)['choices'],
                    disabled = this.store.getField(this.tagName).hasOwnProperty("disabled") ? this.store.getField(this.tagName)['disabled'] : false,
                    size = this.store.getField(this.tagName).hasOwnProperty("size") ? this.store.getField(this.tagName)['size'] : "default";

            return {
                val,
                cityList,
                disabled,
                size
            }
        },
        mounted(){
        },
        methods: {},
        computed: {},
        watch: {
            val: function (v, o) {
                this.store.setVal(this.tagName, v);
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
        components: {CheckboxGroup, Checkbox},
        props: ["store", "tagName"]
    }
</script>
