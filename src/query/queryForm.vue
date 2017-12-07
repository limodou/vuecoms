<template>
    <Card>
        <template v-if="selected.length>0">
            <Row type="flex" align="middle">
                <Col span="1">
                <span style="font-size: 14px; font-weight: bold; color: rgb(70, 76, 91);">已选:</span>
                </Col>
                <Col span="22">
                <Tag v-for="s in selected" :key="s['name']" type="border" closable :name="s['name']"
                     @on-close="selectedCloseEvent">{{s['label']}}:{{s['val']}}
                </Tag>
                </Col>
            </Row>
            <div class="line"></div>
        </template>
        <Form :label-width="80">
            <template v-for="(tags, index) in formLayout">
                <Row type="flex">
                    <template v-for="(tag, index) in tags">
                        <Col span="8">
                        <FormItem :label="getLabel(tag)">
                            <component :is="getType(tag)" :store="store" :tagName="tag" :key="tag"></component>
                        </FormItem>
                        </Col>
                    </template>
                </Row>
                <div class="line"></div>
            </template>
            <Row type="flex" :justify="btnJustify">
                <Col style="margin:5px;" span="2" order="1">
                <Button type="primary" @click="btnSubmit">{{ this.btnOpt.submit.label || '查询' }}</Button>
                </Col>
                <Col style="margin:5px" span="2" order="2">
                <Button v-if="this.hasOwnProperty('btnOpt')&&this.btnOpt.hasOwnProperty('clear')" type="error"
                        @click="btnClear">{{this.btnOpt.clear.label ||'清除' }}
                </Button>
                </Col>
            </Row>
        </Form>
    </Card>
</template>
<style scoped>
    div.ivu-form-item {
        margin: 5px;
    }

    div.line {
        height: 1px;
    }

    div.line:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        /*position: absolute;*/
        /*top: 10px;*/
        /*left: 0;*/
        box-sizing: border-box;
    }

</style>
<script>
    import Vue from "vue";
    import {Form, Row, Col, FormItem, Button, Card, Tag, Icon} from "iview";
    import "iview/dist/styles/iview.css";
    import Store from "./vQueryStore";
    import QueryString from "./queryString.vue"
    import QuerySelect from "./querySelect.vue"
    import QueryDatepicker from "./queryDatepicker.vue"
    import QueryRadio from "./queryRadio.vue"
    import QueryCheckbox from "./queryCheckbox.vue"

    export default {
        props: ["fields", "layout", "value", "buttons", "changed", "submit"],
        components: {
            "str": QueryString,
            "iselect": QuerySelect,
            "date": QueryDatepicker,
            "dateRange": QueryDatepicker,
            "radio": QueryRadio,
            "checkbox": QueryCheckbox,
            Form, Row, Col, FormItem, Button, Card, Tag, Icon
        },
        data(){
            const store = new Store(this, this.fields, this.value);
            //如果没有layout,根据fields的顺序生成layout
            let formLayout = [];
            if (this.layout) {
                formLayout = this.layout;
            } else {
                let arr = [];
                for (let i = 0, len = this.fields.length; i < len; i++) {
                    arr.push(this.fields[i]['name'])
                }
                formLayout.push(arr)
            }

            //button
            let btnOpt = this.buttons,
                    btnJustify = btnOpt && btnOpt.hasOwnProperty("justify") ? btnOpt["justify"] : "end";
            //selected tag { name: "", label: "", val: ""}
            let selected = [];
            return {
                store,
                formLayout,
                btnOpt,
                btnJustify,
                selected
            }
        },
        mounted(){
            //create selected tag
            this.createSelectedTag();
        },
        methods: {
            getLabel(tag){
                for (let i = 0, len = this.fields.length; i < len; i++) {
                    if (this.fields[i]['name'] == tag) {
                        return this.fields[i]['label']
                    }
                }
                return "";
            },
            getType(tag){
                for (let i = 0, len = this.fields.length; i < len; i++) {
                    if (this.fields[i]['name'] == tag) {
                        return this.fields[i]['type']
                    }
                }
                return "";
            },
            createSelectedTag(){
                //To create Selected Tag that base on store.value, just modify store.value, clear selected to blank and call on this method
                for (let k in this.store.getVal()) {
                    let val = this.store.getVal(k),
                            field = this.store.getField(k);
                    if (val && field) {
                        switch (field['type']) {
                            case "str":
                                this.selected.push({name: field['name'], label: field['label'], val: val});
                                break;
                            case "iselect":
                                var vals = [],
                                        isMultiple = field.hasOwnProperty("multiple") ? field['multiple'] : false;
                                if (isMultiple && Array.isArray(val) && val.length > 0) {
                                    for (let v  in val) {
                                        for (let choice in field['choices']) {
                                            ((field['choices'][choice]['value'] == val[v]) && vals.push(field['choices'][choice]['label']));
                                        }
                                    }
                                    this.selected.push({name: field['name'], label: field['label'], val: vals.toString()});
                                } else {
                                    if(typeof val == "string " && val){
                                        for (let choice in field['choices']) {
                                            (field['choices'][choice]['value'] == val) && vals.push(field['choices'][choice]['label'])
                                        }
                                        this.selected.push({name: field['name'], label: field['label'], val: vals.toString()});
                                    }

                                }
                                break;
                            case "date":
                                this.selected.push({name: field['name'], label: field['label'], val: val.toString()});
                                break;
                            case "radio":
                                for (let c in field['choices']) {
                                    (field['choices'][c]['label'] == val) && this.selected.push({
                                        name: field['name'],
                                        label: field['label'],
                                        val: field['choices'][c]['name']
                                    });
                                }
                                break;
                            case "checkbox":
                                var vals = [];
                                if (Array.isArray(val) && val.length > 0) {
                                    for (let c in field['choices']) {
                                        for (let v in val) {
                                            (field['choices'][c]['label'] == val[v]) && vals.push(field['choices'][c]['name']);
                                        }
                                    }
                                    this.selected.push({
                                        name: field['name'],
                                        label: field['label'],
                                        val: vals.toString()
                                    });
                                }
                                break;
                        }
                    }

                }
            },
            selectedCloseEvent(e, name){
                //delete tag from selected
                for (let i in this.selected) {
                    if (this.selected[i]['name'] == name) {
                        this.selected.splice(i, 1);
                    }
                }
                //delete value from store.value
                this.store.delVal(name)
            },
            btnSubmit(){
                //if there is callback function in 'this', call on it and get return value
                if (this.btnOpt.submit.hasOwnProperty("beforeSubmit")) {
                    let p = this.btnOpt.submit.beforeSubmit(this.store.getVal());
                    if (p instanceof Object) {
                        //if the type of return value is an Array,
                        // it meant that rebuild value
                        // then update selected tag and value which is in store
                        this.selected = [];
                        for (let i in p) {
                            this.store.setVal(i, p[i]);
                        }
                        this.createSelectedTag();
                        this.submit(this.store.getVal())
                    } else if (typeof p == "boolean" && p) {
                        //if the type of return value is a boolean and it is true,
                        //update selected tag and value which is in store
                        this.submit(this.store.getVal())
                    }
                }
            },
            btnClear(){
                if (typeof this.changed == "function" && this.changed({})) {
                    this.selected = [];
                    this.store.delVal();
                    this.$emit("query.update", {})
                }
            }
        }
    }
</script>