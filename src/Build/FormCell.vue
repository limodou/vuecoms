<template>
  <div :class="classes">
    <label class="u-layout-cell-label" :style="labelStyle" v-if="col.label">
      <i class="ivu-icon ivu-icon-ios-help-outline" v-if="col.info" :title="col.info"></i>
      {{col.label}}
    </label>
    <div class="u-layout-cell-field" :style="fieldStyle">
      <GenericInput v-bind="col" :value="value"
        :staticSuffix="staticSuffix"
        @on-validate="handleValidate"
        :root="root"></GenericInput>
      <div class="u-layout-cell-help" v-if="col.help && !col.static">{{col.help}}</div>
      <div class="u-layout-cell-error" v-if="error">{{error}}</div>
    </div>
  </div>
</template>

<script>
import GenericInput from '../Fields'
import {validateRule} from './validateUtil'
import { deepCopy } from '../utils/utils';
import Emitter from '@/mixins/emitter.js'

export default {
  name: 'FormCell',
  mixins: {Emitter},
  props: {
    col:{},
    value: {},
    fieldStyle: {},
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelDir: {
      type: String,
      default: 'horizontal'
    },
    validateResult: {
      type: Object,
      default () {
        return {}
      }
    },
    staticSuffix: {
      type: String,
      default: '_static'
    },
    compact: {
      type: Boolean,
      default: false
    },
    root: String
  },
  computed: {
    classes () {
      return {'u-layout-cell': true, 'u-layout-required': this.col.required && !this.col.static,
        'u-layout-error': this.error, 'u-layout-compact': this.compact
      }
    },
    labelStyle () {
      if (this.compact) return {}

      let s = {minWidth: `${this.col.labelWidth}px`}
      switch (this.labelPosition) {
        case 'left':
          s['textAlign'] = 'left'
          break
        case 'right':
          s['textAlign'] = 'right'
          break
        case 'top':
          s['display'] = 'block'
          break
      }
      if (this.labelDir == 'vertical') {
        s['textAlign'] = 'left'
        s['display'] = 'block'
      }
      return s
    },
    error: {
      get () {
        return (this.validateResult[this.col.name] && this.validateResult[this.col.name].error) || ''
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

  methods: {
    validate (type, callback = function () {}) {
      if (!this.col.static)
        validateRule(this.value, this.col.name, this.validateResult)
    },

    handleValidate () {
      this.validate()
    }

  }
}
</script>
