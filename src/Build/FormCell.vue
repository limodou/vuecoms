<template>
  <div :class="classes">
    <label class="u-layout-cell-label">{{col.label}}</label>
    <div class="u-layout-cell-field">
      <GenericInput v-bind="col" :value="value"
        @input="handleInput"
        @on-blur="handleBlur"></GenericInput>
      <div class="u-layout-cell-help" v-if="col.help">{{col.help}}</div>
      <div class="u-layout-cell-error" v-if="error">{{error}}</div>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator';
import GenericInput from './GenericInput'

export default {
  name: 'FormCell',
  props: ['col', 'value'],
  computed: {
    classes () {
      return {'u-layout-row': true, 'u-layout-row-required': this.col.required,
        'u-layout-row-error': this.error
      }
    }
  },

  data () {
    return {error: '', validateState: ''}
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
        const validator = new AsyncValidator(rules)
        validator.validate(this.value, { firstFields: true }, (errors, callabck) => {
            this.validateState = !errors ? 'success' : 'error'
            this.error = errors ? errors[0].message : ''

            callback(this.error)
        })
      }
    },
    handleInput(value, name) {
      this.validate()
    },
    handleBlur () {
      this.validate()
    }
  }
}
</script>
