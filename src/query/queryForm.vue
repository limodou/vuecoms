<template>
        <Form :label-width="80">

            <template v-for="(tags, index) in formLayout">
                <Row>
                    <template v-for="(tag, index) in tags">
                        <Col :span="6">
                            <FormItem :label="getLabel(tag)">
                                <component :is="getType(tag)" :store="store" :tagName="tag" :key="tag"></component>
                            </FormItem>
                        </Col>
                    </template>
                </Row>
            </template>
            <Row>
                <Col :span="24">
                    <Button type="primary" @click="btnClick">{{ this.btnOpt.submit.label || '查询' }}</Button>
                    <Button v-if="this.hasOwnProperty('btnOpt')&&this.btnOpt.hasOwnProperty('clear')" type="error" @click="btnClick2">{{this.btnOpt.clear.label ||'清除' }}</Button>
                </Col>
            </Row>
        </Form>
</template>
<script>
    import Vue from "vue";
    import { Form, Row, Col, FormItem, Button } from "iview";
    import "iview/dist/styles/iview.css";
    import Store from "./vQueryStore";
    import QueryString from "./queryString.vue"
    import QuerySelect from "./querySelect.vue"
    import QueryDatepicker from "./queryDatepicker.vue"
    import QueryRadio from "./queryRadio.vue"
    import QueryCheckbox from "./queryCheckbox.vue"

    export default {
        props: ["fields", "layout", "value", "buttons"],
        components: {
            "str": QueryString,
            "iselect": QuerySelect,
            "date":QueryDatepicker,
            "dateRange":QueryDatepicker,
            "radio":QueryRadio,
            "checkbox":QueryCheckbox,
            Form, Row, Col, FormItem, Button
        },
        data(){
            const store = new Store(this, this.fields, this.value);
            //如果没有layout,根据fields的顺序生成layout
            let formLayout = [];
            if(this.layout){
                formLayout = this.layout;
            }else{
                let arr = [];
                for(let i=0,len=this.fields.length;i<len;i++){
                    arr.push(this.fields[i]['name'])
                }
                formLayout.push(arr)
            }

            //
            let btnOpt = this.buttons;

            return {
                store,
                formLayout,
                btnOpt
            }
        },
        mounted(){

        },
        methods: {
            getLabel(tag){
                for(let i=0, len=this.fields.length;i<len;i++){
                  if(this.fields[i]['name'] == tag){
                      return this.fields[i]['label']
                  }
                }
                return "";
            },
            getType(tag){
                for(let i=0, len=this.fields.length;i<len;i++){
                    if(this.fields[i]['name'] == tag){
                        return this.fields[i]['type']
                    }
                }
                return "";
            },
            btnClick(){
                if(this.btnOpt.hasOwnProperty("submit") && this.btnOpt.submit.hasOwnProperty("callback")){
                    this.btnOpt.submit.callback(this.store.getVal());
                }
            },
            btnClick2(){
                this.store.delVal()
            }
        }
    }
</script>