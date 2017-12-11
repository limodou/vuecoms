<template>
  <div class="u-query">
    <template v-if="selected.length>0">
      <Row align="middle">
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
        <Row v-show="((index+1)>showLineNum?isShow:true)">
          <template v-for="(tag, _index) in tags">
            <Col span="8">
            <FormItem :label="getLabel(tag)">
              <component :is="getType(tag)" :store="store" :tagName="tag" :key="tag"></component>
            </FormItem>
            </Col>
          </template>
        </Row>
        <div class="line" v-show="((index+1)>showLineNum?isShow:true)"></div>
      </template>
      <Row justify="center" class="collapse-line">
                <span @click="showHideSwitch" class="showMoreBtn">
                    {{isShow?"隐藏":"显示"}}
                    <Icon type="ios-arrow-up" v-show="isShow"></Icon>
                    <Icon type="ios-arrow-down" v-show="!isShow"></Icon>
                </span>
      </Row>
      <Row :justify="btnJustify">
        <Col style="margin:5px; text-align:center" span="24">
        <Button type="primary" size="small" @click="btnSubmit">{{ this.btnOpt.submit.label || '查询' }}</Button>
        <Button v-if="this.hasOwnProperty('btnOpt')&&this.btnOpt.hasOwnProperty('clear')" type="error"
                size="small"
                @click="btnClear">{{this.btnOpt.clear.label ||'清除' }}
        </Button>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<style lang="less">
  .u-query {
    padding:15px;

  .ivu-form-item {
    margin: 5px;
  }

  .line {
    height: 1px;
  }

  &:before {
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

  .collapse-line {
    text-align:center;
    border-top:1px solid #eee;
    height: 24px;
    margin-bottom: 10px;

  .showMoreBtn {
    position: absolute;
    border-top: 1px solid white;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 1px 10px;
    -moz-border-radius-bottomleft: 5px;
    -moz-border-radius-bottomright: 5px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: -1px;
    font-size: 12px;
    color: #0000008f;
    left: 50%;
  }

  &:hover {
     border-top:1px solid red;

  .showMoreBtn {
    color: #ff5d4b;
    border-color:#ff5d4b;
    border-top: 1px solid white;
  }
  }

  }

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
  import Emitter from '@/mixins/emitter.js'
  import {QueryURL} from "../utils/utils"
  export default {
    props: ["fields", "layout", "value", "buttons", "changed", "submit", "show-line"],
    mixins: [ Emitter ],
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

      let selected = [],//selected tag { name: "", label: "", val: ""}
        isShow = false; //showLine
      return {
        store,
        selected,
        isShow
      }
    },
    computed:{
      formLayout:function(){
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
        return formLayout;
      },
      showLineNum:function(){
        return (typeof this.showLine == "number") ?
          this.showLine //showLine is number, adopt showLine
          : ((typeof this.showLine == "boolean") //showLine isn't number and check it if boolean
          ? (this.showLine ? 2 : formLayout.length + 1) //showLine is a boolean. if it's true, set it to 2, if not, set it equal to formLayout's length + 1
          : 2);//showLine is not a boolean yet, set default value to 2
      },
      btnOpt:function(){
        let btnOpt = this.buttons?this.buttons:{
          align: "center",//按钮左中右 start center end 默认 end
          submit: {
            label: "点此查询"
          },
          clear: {
            label: "点此清除",
            show: true
          }
        };
        return btnOpt;
      },
      btnJustify: function(){
        return this.btnOpt && this.btnOpt.hasOwnProperty("align") ? this.btnOpt["align"] : "center";
      }
    },
    mounted(){
      //create selected tag
      let qu = new QueryURL(window.location.href);

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
                  this.selected.push({
                    name: field['name'],
                    label: field['label'],
                    val: vals.toString()
                  });
                } else {
                  if ((typeof val == "string") && val) {
                    for (let choice in field['choices']) {
                      (field['choices'][choice]['value'] == val) && vals.push(field['choices'][choice]['label'])
                    }
                    this.selected.push({
                      name: field['name'],
                      label: field['label'],
                      val: vals.toString()
                    });
                  }

                }
                break;
              case "date":
                if (typeof val == "string")val = new Date(val);
                let format = field.hasOwnProperty("format") ? field['format'] : "yyyy-MM-dd",
                  formattedVal = format.replace("yyyy", val.getFullYear()).replace("MM", ((val.getMonth() + 1) < 10) ? "0" + (val.getMonth() + 1) : (val.getMonth() + 1)).replace("dd", ((val.getDate()) < 10) ? "0" + (val.getDate()) : (val.getDate()))
                this.selected.push({name: field['name'], label: field['label'], val: formattedVal});
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
//                if (this.btnOpt.submit.hasOwnProperty("beforeSubmit")) {
//                    let p = this.btnOpt.submit.beforeSubmit(this.store.getVal());
//                    if (p instanceof Object) {
//                        //if the type of return value is an Array,
//                        // it meant that rebuild value
//                        // then update selected tag and value which is in store
//                        this.selected = [];
//                        for (let i in p) {
//                            this.store.setVal(i, p[i]);
//                        }
//                        this.createSelectedTag();
//                let re = this.submit(this.store.getVal());
//                if (re) {
        this.selected = [];
        this.createSelectedTag();
//                }
//                    } else if (typeof p == "boolean" && p) {
//                        //if the type of return value is a boolean and it is true,
//                        //update selected tag and value which is in store
//                        this.submit(this.store.getVal())
//                    }
//                }
        this.$emit("input", this.store.getVal())
      },
      btnClear(){
        if (typeof this.changed == "function" && this.changed({})) {
          this.selected = [];
          this.store.delVal();
          this.$emit("clear", {});
        }
      },
      showHideSwitch(){
        this.isShow = !this.isShow;
      }
    }
  }
</script>
