<template>
  <div :class="classes">
    <label class="u-layout-cell-label" :style="labelStyle">
      <i class="ivu-icon ivu-icon-ios-help-outline" v-if="col.info" :title="col.info"></i>
      {{col.label}}
    </label>
    <div class="u-layout-cell-field">
      <GenericInput v-bind="col" :value="value" @on-display-change="handleDisplay"
        :display="display"
        :staticSuffix="staticSuffix"
        @on-validate="handleValidate"></GenericInput>
      <div class="u-layout-cell-help" v-if="col.help">{{col.help}}</div>
      <div class="u-layout-cell-error" v-if="error">{{error}}</div>
    </div>
  </div>
</template>

<script>
import GenericInput from './GenericInput'
import {validateRule} from './validateUtil'

export default {
  name: 'FormCell',
  props: {
    col:{},
    value: {},
    validateResult: {},
    staticSuffix: {
      type: String,
      default: '_static'
    }
  },
  computed: {
    classes () {
      return {'u-layout-cell': true, 'u-layout-required': this.col.required && !this.col.static,
        'u-layout-error': this.error
      }
    },
    labelStyle () {
      return {minWidth: `${this.col.labelWidth}px`}
    },
    error: {
      get () {
        return this.validateResult[this.col.name].error
      },
      set (v) {
        this.$set(this.validateResult[this.col.name], 'error', v)
      }
    },
    // validateState: {
    //   get () {
    //     return this.validateResult[this.col.name].validateState
    //   },
    //
    //   set (v) {
    //     this.$set(this.validateResult[this.col.name], 'validateState', v)
    //   }
    // }
  },

  data () {
    // 增加对 name_static 属性的支持，可以直接作为静态值进行显示
    return {display: this.value[`${this.col.name}${this.staticSuffix}`] || ''}
  },

  methods: {
    validate (type, callback = function () {}) {
      validateRule(this.value, this.col.name, this.validateResult)
    },

    handleValidate () {
      this.validate()
    },

    handleDisplay (v) {
      this.display = v
    }
  }
}
</script>
