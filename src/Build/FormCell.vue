<template>
  <div :class="classes">
    <label class="u-layout-cell-label" :style="labelStyle">
      <i class="ivu-icon ivu-icon-ios-help-outline" v-if="col.info" :title="col.info"></i>
      {{col.label}}
    </label>
    <div class="u-layout-cell-field">
      <GenericInput v-bind="col" :value="value" @on-display-change="handleDisplay"
        :display="display"
        @on-validate="handleValidate"></GenericInput>
      <div class="u-layout-cell-help" v-if="col.help">{{col.help}}</div>
      <div class="u-layout-cell-error" v-if="error">{{error}}</div>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator';
import GenericInput from './GenericInput'
import AsyncValidatorLang from '@/locale/async-validator'

export default {
  name: 'FormCell',
  props: ['col', 'value'],
  computed: {
    classes () {
      return {'u-layout-cell': true, 'u-layout-required': this.col.required && !this.col.static,
        'u-layout-error': this.error
      }
    },
    labelStyle () {
      return {minWidth: `${this.col.labelWidth}px`}
    }
  },

  data () {
    return {error: '', validateState: '', display: ''}
  },

  methods: {
    getRules (type) {
      // let rules = []
      // rules = this.col.rule.filter((i) => {
      //   (i.trigger === type) || (!i.trigger && type == 'blur')
      // })
      // return rules
      return {[this.col.name]: this.col.rule}
    },
    validate (type, callback = function () {}) {
      let rules = this.getRules(type)
      if (this.col.rule.length > 0) {
        this.validateState = 'validating'
        const validator = new AsyncValidator(rules)
        validator.messages(AsyncValidatorLang)
        validator.validate(this.value, { firstFields: true }, (errors, callabck) => {
            this.validateState = !errors ? 'success' : 'error'
            this.error = errors ? errors[0].message : ''

            callback(this.error)
        })
      }
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
